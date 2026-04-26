import type { Snapshot } from "./types";
import {
  collectUniforms,
  createFramebuffer,
  createFullscreenQuad,
  createRGBA16FTexture,
  hexToRgb,
  linkProgram,
  type UniformMap,
} from "./webgl-utils";

// ─────────────────────────────────────────────────────────────────
// WebGL2 renderer for Particle Life.
//
// Pipeline (matches Life renderer for visual continuity in the series):
//
//   1. Particle pass — instanced quads, one quad per particle, into
//      `sceneFbo`. Vertex shader stretches the quad along velocity for
//      motion-blur look; fragment shader is an anti-aliased disc tinted
//      by species colour with HDR-bright peaks for bloom feed.
//
//   2. Trail pass — ping-pong afterimage. Captures the scene as-is so
//      coloured species leave coloured trails (a green glider trails
//      green, a red predator trails red).
//
//   3. Bloom pass — separable Gaussian blur of the scene at half-res.
//
//   4. Composite — bg + trail·t + scene + bloom·b, Reinhard tonemap,
//      sRGB encode.
//
// Particle data is uploaded to two GL buffers each frame: positions
// (vec2 per particle) and velocity+species (vec3 per particle).
// At N=5000 that's 100 KB / frame — trivially fast.
// ─────────────────────────────────────────────────────────────────

export interface RendererOptions {
  bgColor?: string;
  speciesColors?: readonly string[];
  particleRadius?: number;
  particleSoftness?: number;
  motionStretch?: number;
  hdrIntensity?: number;
  bloomIntensity?: number;
  bloomRadius?: number;
  trailDecayPerSecond?: number;
  trailIntensity?: number;
  // 0..1 — strength of the per-particle z-breath depth illusion.
  // Each particle slowly oscillates in apparent depth at an independent
  // phase, giving the field a 3D-cloud feel.
  zBreathStrength?: number;
  // 0..1 — strength of the screen-centre dome vignette. Particles fade
  // and shrink toward the edges of the inscribed circle.
  domeStrength?: number;
}

interface FullOptions extends Required<RendererOptions> {}

const DEFAULTS: FullOptions = {
  bgColor: "#0F1A2E",
  speciesColors: [
    "#1F4DDE", "#4A7FE8", "#3FB8B0",
    "#F4F1EA", "#E89B6F", "#D8443A",
  ],
  particleRadius: 3.0,
  particleSoftness: 1.4,
  motionStretch: 0.18,
  hdrIntensity: 1.6,
  bloomIntensity: 1.05,
  bloomRadius: 14,
  trailDecayPerSecond: 0.04,
  trailIntensity: 0.42,
  zBreathStrength: 0.65,
  domeStrength: 0.55,
};

// Maximum species count baked into the shader's colour LUT. Real
// simulations are expected to use ≤ 8.
const MAX_SPECIES = 8;

// ─────────────────────────────────────────────────────────────────
// Shaders
// ─────────────────────────────────────────────────────────────────

const VS_FULLSCREEN = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Particle pass — instanced quads.
//
// Two attributes:
//   • a_corner (location 0): unit quad corner in [-1, 1]².
//   • a_pos (location 1):    per-instance world XY position.
//   • a_vel (location 2):    per-instance velocity XY.
//   • a_species (location 3): per-instance species index (uint).
//
// World space is mapped 1:1 to canvas pixels (the engine's worldW/H
// equals the canvas size in CSS px times DPR), so we don't need a
// separate world→canvas matrix.
const VS_PARTICLE = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec2 a_pos;
layout(location = 2) in vec2 a_vel;
layout(location = 3) in uint a_species;

uniform vec2  u_canvasSize;
uniform float u_particleRadius;
uniform float u_motionStretch;
uniform float u_time;            // wall-clock seconds
uniform float u_zBreathStrength; // 0..1 — depth illusion strength
uniform float u_domeStrength;    // 0..1 — radial vignette strength

out vec2  v_localUv;
out vec2  v_localStretch;
out float v_depth;        // 0..1 — closer to 1 = "in front" / brighter
flat out uint v_species;

void main() {
  // ─── Per-particle z phase (pseudo-volume) ────────────────────
  // Each particle gets a stable phase derived from its instance ID.
  // Combined with u_time, it produces a slow oscillation in [0..1] —
  // particles "breathe" between near and far over a few seconds at
  // independent phases, so the field reads as a 3D cloud.
  float phase = fract(sin(float(gl_InstanceID) * 12.9898) * 43758.5453);
  float zBreath = 0.5 + 0.5 * sin(u_time * 0.35 + phase * 6.2831);

  // ─── Dome vignette (radial depth from screen centre) ─────────
  // Particles further from the inscribed circle's centre fade and shrink
  // — like looking through a porthole at a curved volume of activity.
  vec2 fromCenter = a_pos - u_canvasSize * 0.5;
  float halfMin = min(u_canvasSize.x, u_canvasSize.y) * 0.5;
  float r = clamp(length(fromCenter) / halfMin, 0.0, 1.0);
  float zDome = sqrt(max(0.0, 1.0 - r * r));   // hemisphere height

  // Combined depth: blend breath + dome by their respective strengths.
  // We average so neither dominates the rendering at full strength.
  float depth = mix(1.0, zBreath, u_zBreathStrength) *
                mix(1.0, zDome,   u_domeStrength);

  // Size scales with depth (closer = bigger). Range 0.45..1.10.
  float sizeMul = mix(0.45, 1.10, depth);

  // ─── Quad orientation (motion stretch + size) ────────────────
  float speed = length(a_vel);
  float stretch = 1.0 + u_motionStretch * min(speed * 0.05, 4.0);
  vec2 dir = speed > 0.001 ? a_vel / speed : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);

  float radius = u_particleRadius * sizeMul;
  vec2 along = dir  * a_corner.x * radius * stretch;
  vec2 cross = perp * a_corner.y * radius;

  vec2 worldOffset = along + cross;
  vec2 worldPos = a_pos + worldOffset;

  vec2 clipPos = (worldPos / u_canvasSize) * 2.0 - 1.0;
  clipPos.y = -clipPos.y;
  gl_Position = vec4(clipPos, 0.0, 1.0);

  v_localUv = a_corner;
  v_localStretch = vec2(stretch, 1.0);
  v_depth = depth;
  v_species = a_species;
}
`;

const FS_PARTICLE = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_localUv;
in vec2 v_localStretch;
in float v_depth;
flat in uint v_species;
out vec4 fragColor;

uniform vec3  u_speciesColors[${MAX_SPECIES}];
uniform float u_hdrIntensity;
uniform float u_softness;
uniform float u_particleRadius;

void main() {
  vec2 corrected = vec2(v_localUv.x * v_localStretch.x, v_localUv.y * v_localStretch.y);
  corrected /= max(v_localStretch.x, 1.0);

  float dist = length(corrected);
  float aa = u_softness / u_particleRadius;
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0, dist);
  if (disc <= 0.0) discard;

  // Brightness modulates with depth — particles "in front" shine, those
  // "in back" recede. Range tuned so even back particles aren't ghosts.
  float brightness = mix(0.45, 1.05, v_depth);

  vec3 color = u_speciesColors[v_species];
  fragColor = vec4(color * u_hdrIntensity * brightness * disc, disc * brightness);
}
`;

// Trail (afterimage) — same as Life's: capture scene as-is for
// colour-faithful trails.
const FS_TRAIL = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_prevAfterimage;
uniform sampler2D u_scene;
uniform float u_decay;
uniform float u_capture;
void main() {
  vec4 prev = texture(u_prevAfterimage, v_uv);
  vec4 scene = texture(u_scene, v_uv);
  vec4 decayed = prev * u_decay;
  vec4 capture = scene * u_capture;
  fragColor = max(decayed, capture);
}
`;

const FS_BLUR = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_src;
uniform vec2  u_pixel;
uniform vec2  u_dir;
uniform float u_radius;
const float weights[7] = float[](
  0.196482, 0.174670, 0.121281, 0.065691, 0.027693, 0.009091, 0.002324
);
void main() {
  vec4 acc = texture(u_src, v_uv) * weights[0];
  for (int i = 1; i < 7; i++) {
    vec2 off = u_dir * u_pixel * float(i) * (u_radius / 6.0);
    acc += texture(u_src, v_uv + off) * weights[i];
    acc += texture(u_src, v_uv - off) * weights[i];
  }
  fragColor = acc;
}
`;

const FS_COMPOSITE = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_scene;
uniform sampler2D u_afterimage;
uniform sampler2D u_bloom;
uniform vec3  u_bgColor;
uniform float u_trailIntensity;
uniform float u_bloomIntensity;
vec3 reinhard(vec3 x) { return x / (1.0 + x); }
vec3 srgb(vec3 linear) { return pow(max(linear, 0.0), vec3(1.0 / 2.2)); }
void main() {
  vec4 scene = texture(u_scene, v_uv);
  vec4 trail = texture(u_afterimage, v_uv);
  vec4 bloom = texture(u_bloom, v_uv);
  vec3 col = u_bgColor;
  col += trail.rgb * u_trailIntensity;
  col += scene.rgb;
  col += bloom.rgb * u_bloomIntensity;
  col = reinhard(col);
  col = srgb(col);
  fragColor = vec4(col, 1.0);
}
`;

// ─────────────────────────────────────────────────────────────────

interface PingPong {
  texA: WebGLTexture;
  texB: WebGLTexture;
  fboA: WebGLFramebuffer;
  fboB: WebGLFramebuffer;
  readIdx: 0 | 1;
}

export class WebGLRenderer {
  private readonly gl: WebGL2RenderingContext;

  private opts: FullOptions;

  // Geometry — single quad VAO for fullscreen passes; separate VAO for
  // particle instanced rendering with attribute pointers wired up.
  private readonly fullscreenVao: WebGLVertexArrayObject;
  private readonly particleVao: WebGLVertexArrayObject;
  private readonly cornerBuffer: WebGLBuffer;
  private readonly posBuffer: WebGLBuffer;
  private readonly velBuffer: WebGLBuffer;
  private readonly speciesBuffer: WebGLBuffer;

  private readonly particleProgram: WebGLProgram;
  private readonly particleUniforms: UniformMap;
  private readonly trailProgram: WebGLProgram;
  private readonly trailUniforms: UniformMap;
  private readonly blurProgram: WebGLProgram;
  private readonly blurUniforms: UniformMap;
  private readonly compositeProgram: WebGLProgram;
  private readonly compositeUniforms: UniformMap;

  // Off-screen targets — sized to canvas pixel resolution.
  private sceneTex: WebGLTexture | null = null;
  private sceneFbo: WebGLFramebuffer | null = null;
  private bloomA: WebGLTexture | null = null;
  private bloomB: WebGLTexture | null = null;
  private bloomFboA: WebGLFramebuffer | null = null;
  private bloomFboB: WebGLFramebuffer | null = null;
  private afterimage: PingPong | null = null;

  private canvasW = 0;
  private canvasH = 0;
  private bloomW = 0;
  private bloomH = 0;

  // Cached colour vectors.
  private bgRgb: [number, number, number];
  private speciesRgb: number[]; // flat, length = MAX_SPECIES * 3

  // Capacity of the GPU buffers — grown on demand.
  private particleCapacity = 0;

  private lastRenderTime = 0;

  constructor(canvas: HTMLCanvasElement, options: RendererOptions = {}) {
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: true,
      alpha: false,
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;

    if (!gl.getExtension("EXT_color_buffer_half_float") && !gl.getExtension("EXT_color_buffer_float")) {
      throw new Error("EXT_color_buffer_half_float not supported");
    }

    this.opts = { ...DEFAULTS, ...options };
    this.bgRgb = hexToRgb(this.opts.bgColor);
    this.speciesRgb = this.flattenSpeciesColors(this.opts.speciesColors);

    // Programs.
    this.particleProgram = linkProgram(gl, VS_PARTICLE, FS_PARTICLE, "particle");
    this.particleUniforms = collectUniforms(gl, this.particleProgram, [
      "u_canvasSize", "u_particleRadius", "u_motionStretch",
      "u_hdrIntensity", "u_softness", "u_time",
      "u_zBreathStrength", "u_domeStrength",
      ...Array.from({ length: MAX_SPECIES }, (_, i) => `u_speciesColors[${i}]`),
    ]);

    this.trailProgram = linkProgram(gl, VS_FULLSCREEN, FS_TRAIL, "trail");
    this.trailUniforms = collectUniforms(gl, this.trailProgram, [
      "u_prevAfterimage", "u_scene", "u_decay", "u_capture",
    ]);

    this.blurProgram = linkProgram(gl, VS_FULLSCREEN, FS_BLUR, "blur");
    this.blurUniforms = collectUniforms(gl, this.blurProgram, [
      "u_src", "u_pixel", "u_dir", "u_radius",
    ]);

    this.compositeProgram = linkProgram(gl, VS_FULLSCREEN, FS_COMPOSITE, "composite");
    this.compositeUniforms = collectUniforms(gl, this.compositeProgram, [
      "u_scene", "u_afterimage", "u_bloom", "u_bgColor",
      "u_trailIntensity", "u_bloomIntensity",
    ]);

    // Geometry.
    this.fullscreenVao = createFullscreenQuad(gl);

    // Particle VAO with instanced attributes.
    const particleVao = gl.createVertexArray();
    if (!particleVao) throw new Error("createVertexArray failed");
    this.particleVao = particleVao;
    gl.bindVertexArray(particleVao);

    // a_corner — unit quad, NOT instanced.
    const cornerBuf = gl.createBuffer();
    if (!cornerBuf) throw new Error("createBuffer failed");
    this.cornerBuffer = cornerBuf;
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // a_pos — per-instance position. Allocated zero-sized; resized later.
    const posBuf = gl.createBuffer();
    if (!posBuf) throw new Error("createBuffer failed");
    this.posBuffer = posBuf;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);

    // a_vel — per-instance velocity.
    const velBuf = gl.createBuffer();
    if (!velBuf) throw new Error("createBuffer failed");
    this.velBuffer = velBuf;
    gl.bindBuffer(gl.ARRAY_BUFFER, velBuf);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(2, 1);

    // a_species — per-instance integer.
    const speciesBuf = gl.createBuffer();
    if (!speciesBuf) throw new Error("createBuffer failed");
    this.speciesBuffer = speciesBuf;
    gl.bindBuffer(gl.ARRAY_BUFFER, speciesBuf);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribIPointer(3, 1, gl.UNSIGNED_BYTE, 0, 0);
    gl.vertexAttribDivisor(3, 1);

    gl.bindVertexArray(null);

    this.lastRenderTime = performance.now();
  }

  // ─── Public configuration ────────────────────────────────────────

  setOptions(partial: Partial<RendererOptions>): void {
    this.opts = { ...this.opts, ...partial };
    if (partial.bgColor) this.bgRgb = hexToRgb(this.opts.bgColor);
    if (partial.speciesColors) {
      this.speciesRgb = this.flattenSpeciesColors(this.opts.speciesColors);
    }
  }

  resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    if (width === this.canvasW && height === this.canvasH) return;
    this.canvasW = width;
    this.canvasH = height;
    this.bloomW = Math.max(2, width >> 1);
    this.bloomH = Math.max(2, height >> 1);

    const gl = this.gl;
    this.deleteCanvasResources();

    this.sceneTex = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    this.sceneFbo = createFramebuffer(gl, this.sceneTex);

    this.bloomA = createRGBA16FTexture(gl, this.bloomW, this.bloomH, gl.LINEAR);
    this.bloomB = createRGBA16FTexture(gl, this.bloomW, this.bloomH, gl.LINEAR);
    this.bloomFboA = createFramebuffer(gl, this.bloomA);
    this.bloomFboB = createFramebuffer(gl, this.bloomB);

    const aiA = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    const aiB = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    this.afterimage = {
      texA: aiA,
      texB: aiB,
      fboA: createFramebuffer(gl, aiA),
      fboB: createFramebuffer(gl, aiB),
      readIdx: 0,
    };
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.afterimage.fboA);
    gl.viewport(0, 0, this.canvasW, this.canvasH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.afterimage.fboB);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // ─── Particle data upload ────────────────────────────────────────

  uploadParticles(snapshot: Snapshot): void {
    const gl = this.gl;
    if (snapshot.count > this.particleCapacity) {
      // Grow the GPU buffers (allocate to 1.5× to amortise).
      const newCap = Math.ceil(snapshot.count * 1.5);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, newCap * 2 * 4, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.velBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, newCap * 2 * 4, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.speciesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, newCap, gl.DYNAMIC_DRAW);
      this.particleCapacity = newCap;
    }
    // Pack posX/posY into a single Float32Array. We avoid an
    // allocation per frame by using a scratch buffer kept on the
    // renderer.
    const N = snapshot.count;
    if (this.scratchPos.length < N * 2) this.scratchPos = new Float32Array(N * 2);
    if (this.scratchVel.length < N * 2) this.scratchVel = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      this.scratchPos[i * 2]     = snapshot.posX[i];
      this.scratchPos[i * 2 + 1] = snapshot.posY[i];
      this.scratchVel[i * 2]     = snapshot.velX[i];
      this.scratchVel[i * 2 + 1] = snapshot.velY[i];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.scratchPos, 0, N * 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.velBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.scratchVel, 0, N * 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.speciesBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, snapshot.species, 0, N);
  }

  private scratchPos = new Float32Array(0);
  private scratchVel = new Float32Array(0);

  // ─── Render ──────────────────────────────────────────────────────

  render(snapshot: Snapshot): void {
    if (!this.sceneFbo || !this.afterimage) return;
    const gl = this.gl;

    const now = performance.now();
    const dtSeconds = Math.max(0, Math.min(0.1, (now - this.lastRenderTime) / 1000));
    this.lastRenderTime = now;

    this.passParticles(snapshot);
    this.passTrail(dtSeconds);
    this.passBloom();
    this.passComposite();

    gl.bindVertexArray(null);
  }

  private passParticles(snapshot: Snapshot): void {
    const gl = this.gl;
    if (!this.sceneFbo) return;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFbo);
    gl.viewport(0, 0, this.canvasW, this.canvasH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Additive blending so overlapping particles brighten rather than overwrite.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.useProgram(this.particleProgram);
    gl.bindVertexArray(this.particleVao);

    if (this.particleUniforms.u_canvasSize) {
      gl.uniform2f(this.particleUniforms.u_canvasSize, snapshot.worldW, snapshot.worldH);
    }
    if (this.particleUniforms.u_particleRadius) {
      gl.uniform1f(this.particleUniforms.u_particleRadius, this.opts.particleRadius);
    }
    if (this.particleUniforms.u_motionStretch) {
      gl.uniform1f(this.particleUniforms.u_motionStretch, this.opts.motionStretch);
    }
    if (this.particleUniforms.u_hdrIntensity) {
      gl.uniform1f(this.particleUniforms.u_hdrIntensity, this.opts.hdrIntensity);
    }
    if (this.particleUniforms.u_softness) {
      gl.uniform1f(this.particleUniforms.u_softness, this.opts.particleSoftness);
    }
    if (this.particleUniforms.u_time) {
      gl.uniform1f(this.particleUniforms.u_time, this.lastRenderTime / 1000);
    }
    if (this.particleUniforms.u_zBreathStrength) {
      gl.uniform1f(this.particleUniforms.u_zBreathStrength, this.opts.zBreathStrength);
    }
    if (this.particleUniforms.u_domeStrength) {
      gl.uniform1f(this.particleUniforms.u_domeStrength, this.opts.domeStrength);
    }
    // Upload species colour LUT as N × vec3.
    for (let i = 0; i < MAX_SPECIES; i++) {
      const loc = this.particleUniforms[`u_speciesColors[${i}]`];
      if (loc) {
        gl.uniform3f(
          loc,
          this.speciesRgb[i * 3] || 0,
          this.speciesRgb[i * 3 + 1] || 0,
          this.speciesRgb[i * 3 + 2] || 0,
        );
      }
    }

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, snapshot.count);
    gl.disable(gl.BLEND);
  }

  private passTrail(dtSeconds: number): void {
    const gl = this.gl;
    if (!this.afterimage || !this.sceneTex) return;

    const readTex = this.afterimage.readIdx === 0 ? this.afterimage.texA : this.afterimage.texB;
    const writeFbo = this.afterimage.readIdx === 0 ? this.afterimage.fboB : this.afterimage.fboA;

    gl.bindFramebuffer(gl.FRAMEBUFFER, writeFbo);
    gl.viewport(0, 0, this.canvasW, this.canvasH);

    gl.useProgram(this.trailProgram);
    gl.bindVertexArray(this.fullscreenVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, readTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTex);

    if (this.trailUniforms.u_prevAfterimage) gl.uniform1i(this.trailUniforms.u_prevAfterimage, 0);
    if (this.trailUniforms.u_scene) gl.uniform1i(this.trailUniforms.u_scene, 1);
    const remainingPerSec = Math.max(0, Math.min(1, this.opts.trailDecayPerSecond));
    const frameDecay = Math.pow(remainingPerSec, dtSeconds);
    if (this.trailUniforms.u_decay) gl.uniform1f(this.trailUniforms.u_decay, frameDecay);
    if (this.trailUniforms.u_capture) gl.uniform1f(this.trailUniforms.u_capture, 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.afterimage.readIdx = this.afterimage.readIdx === 0 ? 1 : 0;
  }

  private passBloom(): void {
    const gl = this.gl;
    if (!this.sceneTex || !this.bloomFboA || !this.bloomFboB || !this.bloomA) return;

    gl.useProgram(this.blurProgram);
    gl.bindVertexArray(this.fullscreenVao);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFboA);
    gl.viewport(0, 0, this.bloomW, this.bloomH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTex);
    if (this.blurUniforms.u_src) gl.uniform1i(this.blurUniforms.u_src, 0);
    if (this.blurUniforms.u_pixel) gl.uniform2f(this.blurUniforms.u_pixel, 1.0 / this.canvasW, 1.0 / this.canvasH);
    if (this.blurUniforms.u_dir) gl.uniform2f(this.blurUniforms.u_dir, 1.0, 0.0);
    if (this.blurUniforms.u_radius) gl.uniform1f(this.blurUniforms.u_radius, this.opts.bloomRadius);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFboB);
    gl.viewport(0, 0, this.bloomW, this.bloomH);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomA);
    if (this.blurUniforms.u_pixel) gl.uniform2f(this.blurUniforms.u_pixel, 1.0 / this.bloomW, 1.0 / this.bloomH);
    if (this.blurUniforms.u_dir) gl.uniform2f(this.blurUniforms.u_dir, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private passComposite(): void {
    const gl = this.gl;
    if (!this.sceneTex || !this.bloomB || !this.afterimage) return;
    const readTex = this.afterimage.readIdx === 0 ? this.afterimage.texA : this.afterimage.texB;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvasW, this.canvasH);

    gl.useProgram(this.compositeProgram);
    gl.bindVertexArray(this.fullscreenVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, readTex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomB);

    if (this.compositeUniforms.u_scene) gl.uniform1i(this.compositeUniforms.u_scene, 0);
    if (this.compositeUniforms.u_afterimage) gl.uniform1i(this.compositeUniforms.u_afterimage, 1);
    if (this.compositeUniforms.u_bloom) gl.uniform1i(this.compositeUniforms.u_bloom, 2);
    if (this.compositeUniforms.u_bgColor) gl.uniform3f(this.compositeUniforms.u_bgColor, ...this.bgRgb);
    if (this.compositeUniforms.u_trailIntensity) gl.uniform1f(this.compositeUniforms.u_trailIntensity, this.opts.trailIntensity);
    if (this.compositeUniforms.u_bloomIntensity) gl.uniform1f(this.compositeUniforms.u_bloomIntensity, this.opts.bloomIntensity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // ─── Cleanup ─────────────────────────────────────────────────────

  private deleteCanvasResources(): void {
    const gl = this.gl;
    if (this.sceneTex) gl.deleteTexture(this.sceneTex);
    if (this.sceneFbo) gl.deleteFramebuffer(this.sceneFbo);
    if (this.bloomA) gl.deleteTexture(this.bloomA);
    if (this.bloomB) gl.deleteTexture(this.bloomB);
    if (this.bloomFboA) gl.deleteFramebuffer(this.bloomFboA);
    if (this.bloomFboB) gl.deleteFramebuffer(this.bloomFboB);
    if (this.afterimage) {
      gl.deleteTexture(this.afterimage.texA);
      gl.deleteTexture(this.afterimage.texB);
      gl.deleteFramebuffer(this.afterimage.fboA);
      gl.deleteFramebuffer(this.afterimage.fboB);
    }
    this.sceneTex = null;
    this.sceneFbo = null;
    this.bloomA = null;
    this.bloomB = null;
    this.bloomFboA = null;
    this.bloomFboB = null;
    this.afterimage = null;
  }

  destroy(): void {
    const gl = this.gl;
    this.deleteCanvasResources();
    gl.deleteProgram(this.particleProgram);
    gl.deleteProgram(this.trailProgram);
    gl.deleteProgram(this.blurProgram);
    gl.deleteProgram(this.compositeProgram);
    gl.deleteVertexArray(this.fullscreenVao);
    gl.deleteVertexArray(this.particleVao);
    gl.deleteBuffer(this.cornerBuffer);
    gl.deleteBuffer(this.posBuffer);
    gl.deleteBuffer(this.velBuffer);
    gl.deleteBuffer(this.speciesBuffer);
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  private flattenSpeciesColors(colors: readonly string[]): number[] {
    const out: number[] = new Array(MAX_SPECIES * 3).fill(0);
    for (let i = 0; i < Math.min(colors.length, MAX_SPECIES); i++) {
      const [r, g, b] = hexToRgb(colors[i]);
      out[i * 3]     = r;
      out[i * 3 + 1] = g;
      out[i * 3 + 2] = b;
    }
    return out;
  }
}
