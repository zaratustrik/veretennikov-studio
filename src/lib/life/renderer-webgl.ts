import type { Snapshot } from "./types";
import {
  collectUniforms,
  createFramebuffer,
  createFullscreenQuad,
  createR8Texture,
  createRGBA16FTexture,
  hexToRgb,
  linkProgram,
  uploadR8Texture,
  type UniformMap,
} from "./webgl-utils";

// ─────────────────────────────────────────────────────────────────
// WebGL2 Life renderer.
//
// Pipeline per frame:
//
//   1. Cell pass — render alive cells into `sceneFbo`. Reads the
//      prev/curr R8 textures uploaded from the engine and uses the
//      tween factor `t ∈ [0, 1]` to fade births in / deaths out.
//      Cell shape is an anti-aliased disc, not a square.
//
//   2. Trail pass — ping-pong an "afterimage" buffer:
//
//          afterimage_new = max(afterimage_old * decay, scene)
//
//      Decay is applied per *real-time* second, so trails stay
//      consistent regardless of frame rate or simulation tick rate.
//
//   3. Bloom pass — separable Gaussian blur of the scene at
//      half-resolution: horizontal then vertical.
//
//   4. Composite pass — to default framebuffer:
//      bg + scene + afterimage * trailIntensity + bloom * bloomIntensity.
//
// Everything runs in linear-light HDR (RGBA16F intermediate FBOs);
// the final pass tonemaps with a soft Reinhard before sRGB output.
// ─────────────────────────────────────────────────────────────────

export interface RendererOptions {
  // Visual tuning. All have sensible defaults — change at runtime via setOptions.
  bgColor?: string;          // page-side background (hex). Default = ink.
  aliveColor?: string;       // cell base colour for "established" cells (age ~10–30). Default = warm cream.
  ancientColor?: string;     // colour for very long-lived cells (age ≥ maturationAge). Default = warm amber.
  birthTint?: string;        // colour bias during fade-in. Default = cobalt.
  deathTint?: string;        // colour bias during fade-out. Default = ink-3.
  infectedColor?: string;    // colour for infected cells. Default = warm brick red.
  trailColor?: string;       // afterimage tint. Default = cobalt-ish.
  cellRadius?: number;       // 0..0.5 — radius of disc inside cell square. Default = 0.42.
  cellEdgeSoftness?: number; // pixels of antialiased edge. Default = 1.5.
  bloomIntensity?: number;   // 0..2. Default = 0.85.
  bloomThreshold?: number;   // luminance below which bloom is suppressed. Default = 0.0 (everything blooms).
  bloomRadius?: number;      // pixels. Default = 16.
  trailDecayPerSecond?: number; // multiplicative decay/sec. Default = 0.10 (trail half-life ~0.30s).
  trailIntensity?: number;   // 0..1 contribution at composite. Default = 0.45.
  maturationAge?: number;    // generations before a cell is fully "ancient". Default = 100.
}

interface FullOptions extends Required<RendererOptions> {}

const DEFAULTS: FullOptions = {
  bgColor: "#0F1A2E",
  aliveColor: "#F4F1EA",
  ancientColor: "#E89B6F",
  birthTint: "#1F4DDE",
  deathTint: "#7A8DB0",
  infectedColor: "#F23A2D",
  trailColor: "#3B5BCF",
  cellRadius: 0.42,
  cellEdgeSoftness: 1.5,
  bloomIntensity: 0.95,
  bloomThreshold: 0.0,
  bloomRadius: 16,
  trailDecayPerSecond: 0.1,
  trailIntensity: 0.45,
  maturationAge: 100,
};

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

// Cell pass: read prev/curr R8 textures, render cell as anti-aliased disc.
const FS_CELL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_prev;
uniform sampler2D u_curr;
uniform sampler2D u_age;       // R8: per-cell age in generations / 255
uniform sampler2D u_infected;  // R8: per-cell infection age / 255 (0 = healthy)
uniform vec2  u_gridSize;
uniform vec2  u_canvasSize;
uniform float u_t;
uniform float u_time;          // wall-clock seconds for animated effects
uniform float u_cellRadius;
uniform float u_edgePixels;
uniform float u_ageScale;      // multiplier mapping (age/255) → gradient parameter [0..1]
uniform float u_infectionScale;// multiplier mapping (inf/255) → ramp parameter
uniform vec3  u_aliveColor;
uniform vec3  u_ancientColor;
uniform vec3  u_birthTint;
uniform vec3  u_deathTint;
uniform vec3  u_infectedColor;

float easeOutCubic(float x) {
  float u = 1.0 - x;
  return 1.0 - u * u * u;
}

float easeInCubic(float x) {
  return x * x * x;
}

void main() {
  vec2 gridPos = v_uv * u_gridSize;
  vec2 cellIdx = floor(gridPos);
  vec2 cellLocal = gridPos - cellIdx;
  vec2 sampleUv = (cellIdx + 0.5) / u_gridSize;

  // R8 textures normalise byte → float, so an "alive" cell stored as 1
  // arrives here as 1.0/255.0 ≈ 0.0039. Dead cells are exactly 0.0, so
  // any positive value means alive.
  bool pAlive = texture(u_prev, sampleUv).r > 0.0;
  bool cAlive = texture(u_curr, sampleUv).r > 0.0;

  // Age — only meaningful for cells alive in curr.
  float ageNorm = texture(u_age, sampleUv).r;        // age / 255
  float ageT = smoothstep(0.05, 1.0, clamp(ageNorm * u_ageScale, 0.0, 1.0));
  vec3 ageColor = mix(u_aliveColor, u_ancientColor, ageT);

  // Infection — instant full-red replacement (not a tint), and the colour
  // is output in HDR range (intensity 1.5..3.0×) so the bloom pass picks
  // it up powerfully and infected cells look like they GLOW, not just
  // colour-shift. Older infections (closer to death) glow brighter.
  // Each cell gets a phase-offset pulse so the wave looks alive.
  float infNorm = texture(u_infected, sampleUv).r;
  float infected = step(0.5 / 255.0, infNorm);
  float infectedRamp = clamp(infNorm * u_infectionScale, 0.0, 1.0);
  float pulsePhase = (cellIdx.x * 0.13 + cellIdx.y * 0.07) + u_time * 0.9;
  float pulse = 0.85 + 0.15 * sin(pulsePhase * 6.2831);
  float infectedIntensity = (1.5 + 1.5 * infectedRamp) * pulse;
  vec3 establishedColor = mix(ageColor, u_infectedColor * infectedIntensity, infected);

  float alpha = 0.0;
  vec3 color = u_aliveColor;

  if (pAlive && cAlive) {
    alpha = 1.0;
    color = establishedColor;
  } else if (!pAlive && cAlive) {
    // Birth: fade in from cobalt to the cell's established colour.
    float k = easeOutCubic(u_t);
    alpha = k;
    color = mix(u_birthTint, establishedColor, k);
  } else if (pAlive && !cAlive) {
    // Death: fade through deathTint towards transparent.
    float k = 1.0 - easeInCubic(u_t);
    alpha = k;
    color = mix(u_deathTint, establishedColor, k);
  }

  if (alpha <= 0.0001) {
    fragColor = vec4(0.0);
    return;
  }

  // Anti-aliased disc inside the cell.
  vec2 d = cellLocal - 0.5;
  float dist = length(d);
  // Pixel size in cell-local coords.
  float pxPerCell = min(u_canvasSize.x / u_gridSize.x, u_canvasSize.y / u_gridSize.y);
  float aaWidth = u_edgePixels / max(pxPerCell, 1.0);
  float disc = 1.0 - smoothstep(u_cellRadius - aaWidth, u_cellRadius, dist);

  float a = alpha * disc;
  // Premultiplied alpha output — additive-friendly downstream.
  fragColor = vec4(color * a, a);
}
`;

// Trail update: afterimage_new = max(afterimage_old * decay, scene)
const FS_TRAIL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_prevAfterimage;
uniform sampler2D u_scene;
uniform float u_decay;        // multiplicative factor applied this frame
uniform float u_capture;      // how much of new scene goes into trail (0..1)

void main() {
  vec4 prev = texture(u_prevAfterimage, v_uv);
  vec4 scene = texture(u_scene, v_uv);

  // Decay the previous afterimage.
  vec4 decayed = prev * u_decay;

  // Capture the scene as-is so the trail preserves the cell's actual
  // colour. Cobalt births leave cobalt trails; red infections leave red
  // trails. This is what makes an epidemic wave look like a wave rather
  // than scattered red dots — the path of dying cells is painted in red.
  vec4 capture = scene * u_capture;

  // Channel-wise max so highlights don't sum past 1 in the trail buffer.
  fragColor = max(decayed, capture);
}
`;

// Separable Gaussian blur — one direction per pass.
// Sigma is implicit in the offsets; weights are precomputed for sigma ≈ 4 px
// scaled by u_radius. We use 13 taps via 7 bilinear samples (weighted offsets).
const FS_BLUR = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_src;
uniform vec2  u_pixel;        // 1.0 / textureSize, scaled to current FBO size
uniform vec2  u_dir;           // (1,0) for horizontal, (0,1) for vertical
uniform float u_radius;        // blur radius in pixels (input texture's pixels)

// 7-tap Gaussian (precomputed weights for σ ≈ 1.0; we expand by u_radius).
const float weights[7] = float[](
  0.196482,
  0.174670,
  0.121281,
  0.065691,
  0.027693,
  0.009091,
  0.002324
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

// Composite: bg + scene + afterimage * trailIntensity + bloom * bloomIntensity.
// Scene and bloom are HDR; afterimage is also HDR. Soft Reinhard + sRGB at output.
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

vec3 reinhard(vec3 x) {
  return x / (1.0 + x);
}

vec3 srgb(vec3 linear) {
  // Cheap, accurate-enough sRGB encoding.
  return pow(max(linear, 0.0), vec3(1.0 / 2.2));
}

void main() {
  vec4 scene = texture(u_scene, v_uv);
  vec4 trail = texture(u_afterimage, v_uv);
  vec4 bloom = texture(u_bloom, v_uv);

  vec3 col = u_bgColor;
  // Trail is the "ghost" layer behind cells.
  col += trail.rgb * u_trailIntensity;
  // Sharp cells on top of trail.
  col += scene.rgb;
  // Soft glow from bloom.
  col += bloom.rgb * u_bloomIntensity;

  col = reinhard(col);
  col = srgb(col);

  fragColor = vec4(col, 1.0);
}
`;

// ─────────────────────────────────────────────────────────────────
// Renderer
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
  private readonly canvas: HTMLCanvasElement;

  private opts: FullOptions;

  // Geometry — single fullscreen VAO reused by every program.
  private readonly quadVao: WebGLVertexArrayObject;

  // Programs and their uniform maps.
  private readonly cellProgram: WebGLProgram;
  private readonly cellUniforms: UniformMap;
  private readonly trailProgram: WebGLProgram;
  private readonly trailUniforms: UniformMap;
  private readonly blurProgram: WebGLProgram;
  private readonly blurUniforms: UniformMap;
  private readonly compositeProgram: WebGLProgram;
  private readonly compositeUniforms: UniformMap;

  // Engine grid textures (R8). Recreated when grid size changes.
  private prevTex: WebGLTexture | null = null;
  private currTex: WebGLTexture | null = null;
  private ageTex: WebGLTexture | null = null;
  private infectedTex: WebGLTexture | null = null;
  private gridW = 0;
  private gridH = 0;

  // Off-screen render targets — sized to canvas pixel resolution.
  // Scene at full res; bloom at half res; afterimage at full res with ping-pong.
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

  // Background colour cached as RGB triple.
  private bgRgb: [number, number, number];
  private aliveRgb: [number, number, number];
  private ancientRgb: [number, number, number];
  private birthRgb: [number, number, number];
  private deathRgb: [number, number, number];
  private infectedRgb: [number, number, number];
  private trailRgb: [number, number, number];

  // Wall-clock at last render for time-based decay.
  private lastRenderTime = 0;

  constructor(canvas: HTMLCanvasElement, options: RendererOptions = {}) {
    const gl = canvas.getContext("webgl2", {
      antialias: false,         // we do AA in shader
      premultipliedAlpha: true, // matches our shader output
      alpha: false,
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;
    this.canvas = canvas;

    // Required for RGBA16F render targets.
    if (!gl.getExtension("EXT_color_buffer_half_float") && !gl.getExtension("EXT_color_buffer_float")) {
      throw new Error("EXT_color_buffer_half_float not supported");
    }

    this.opts = { ...DEFAULTS, ...options };
    this.bgRgb = hexToRgb(this.opts.bgColor);
    this.aliveRgb = hexToRgb(this.opts.aliveColor);
    this.ancientRgb = hexToRgb(this.opts.ancientColor);
    this.birthRgb = hexToRgb(this.opts.birthTint);
    this.deathRgb = hexToRgb(this.opts.deathTint);
    this.infectedRgb = hexToRgb(this.opts.infectedColor);
    this.trailRgb = hexToRgb(this.opts.trailColor);

    // Programs.
    this.cellProgram = linkProgram(gl, VS_FULLSCREEN, FS_CELL, "cell");
    this.cellUniforms = collectUniforms(gl, this.cellProgram, [
      "u_prev", "u_curr", "u_age", "u_infected", "u_gridSize", "u_canvasSize", "u_t",
      "u_time", "u_cellRadius", "u_edgePixels", "u_ageScale", "u_infectionScale",
      "u_aliveColor", "u_ancientColor", "u_birthTint", "u_deathTint", "u_infectedColor",
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
      "u_scene", "u_afterimage", "u_bloom", "u_bgColor", "u_trailIntensity", "u_bloomIntensity",
    ]);

    this.quadVao = createFullscreenQuad(gl);

    this.lastRenderTime = performance.now();
  }

  // ─── Public configuration ────────────────────────────────────────

  setOptions(partial: Partial<RendererOptions>): void {
    this.opts = { ...this.opts, ...partial };
    if (partial.bgColor) this.bgRgb = hexToRgb(this.opts.bgColor);
    if (partial.aliveColor) this.aliveRgb = hexToRgb(this.opts.aliveColor);
    if (partial.ancientColor) this.ancientRgb = hexToRgb(this.opts.ancientColor);
    if (partial.birthTint) this.birthRgb = hexToRgb(this.opts.birthTint);
    if (partial.deathTint) this.deathRgb = hexToRgb(this.opts.deathTint);
    if (partial.infectedColor) this.infectedRgb = hexToRgb(this.opts.infectedColor);
    if (partial.trailColor) this.trailRgb = hexToRgb(this.opts.trailColor);
  }

  // (Re)allocate canvas-sized FBOs. Call when canvas pixel size changes.
  resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    if (width === this.canvasW && height === this.canvasH) return;
    this.canvasW = width;
    this.canvasH = height;
    this.bloomW = Math.max(2, width >> 1);
    this.bloomH = Math.max(2, height >> 1);

    const gl = this.gl;

    // Clean old.
    this.deleteCanvasResources();

    // Scene FBO — full res RGBA16F.
    this.sceneTex = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    this.sceneFbo = createFramebuffer(gl, this.sceneTex);

    // Bloom ping-pong FBOs — half-res RGBA16F with linear filtering for
    // bilinear sampling during blur.
    this.bloomA = createRGBA16FTexture(gl, this.bloomW, this.bloomH, gl.LINEAR);
    this.bloomB = createRGBA16FTexture(gl, this.bloomW, this.bloomH, gl.LINEAR);
    this.bloomFboA = createFramebuffer(gl, this.bloomA);
    this.bloomFboB = createFramebuffer(gl, this.bloomB);

    // Afterimage ping-pong — full res RGBA16F.
    const aiA = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    const aiB = createRGBA16FTexture(gl, this.canvasW, this.canvasH, gl.LINEAR);
    this.afterimage = {
      texA: aiA,
      texB: aiB,
      fboA: createFramebuffer(gl, aiA),
      fboB: createFramebuffer(gl, aiB),
      readIdx: 0,
    };
    // Clear afterimage to black on creation so first frame doesn't sample garbage.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.afterimage.fboA);
    gl.viewport(0, 0, this.canvasW, this.canvasH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.afterimage.fboB);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // (Re)allocate the engine grid textures. Call when simulation size changes.
  setGridSize(width: number, height: number): void {
    if (
      width === this.gridW && height === this.gridH &&
      this.prevTex && this.currTex && this.ageTex && this.infectedTex
    ) return;
    const gl = this.gl;
    if (this.prevTex) gl.deleteTexture(this.prevTex);
    if (this.currTex) gl.deleteTexture(this.currTex);
    if (this.ageTex) gl.deleteTexture(this.ageTex);
    if (this.infectedTex) gl.deleteTexture(this.infectedTex);
    this.gridW = width;
    this.gridH = height;
    // NEAREST sampling so cells are crisp; we do AA in shader inside cells.
    this.prevTex = createR8Texture(gl, width, height, gl.NEAREST);
    this.currTex = createR8Texture(gl, width, height, gl.NEAREST);
    this.ageTex = createR8Texture(gl, width, height, gl.NEAREST);
    this.infectedTex = createR8Texture(gl, width, height, gl.NEAREST);
    // Initialise to zeros so first upload is incremental.
    const empty = new Uint8Array(width * height);
    uploadR8Texture(gl, this.prevTex, width, height, empty);
    uploadR8Texture(gl, this.currTex, width, height, empty);
    uploadR8Texture(gl, this.ageTex, width, height, empty);
    uploadR8Texture(gl, this.infectedTex, width, height, empty);
  }

  uploadState(prev: Snapshot, curr: Snapshot): void {
    if (prev.width !== this.gridW || prev.height !== this.gridH) {
      this.setGridSize(prev.width, prev.height);
    }
    if (!this.prevTex || !this.currTex || !this.ageTex || !this.infectedTex) return;
    const gl = this.gl;
    uploadR8Texture(gl, this.prevTex, this.gridW, this.gridH, prev.data);
    uploadR8Texture(gl, this.currTex, this.gridW, this.gridH, curr.data);
    // Engine keeps a single ageBuf and a single shared infection mirror,
    // so we upload curr's references — prev's would be identical.
    uploadR8Texture(gl, this.ageTex, this.gridW, this.gridH, curr.age);
    uploadR8Texture(gl, this.infectedTex, this.gridW, this.gridH, curr.infected);
  }

  // ─── Render entry-point ─────────────────────────────────────────

  render(t: number): void {
    if (!this.sceneFbo || !this.afterimage) return;
    const gl = this.gl;
    gl.bindVertexArray(this.quadVao);

    const now = performance.now();
    const dtSeconds = Math.max(0, Math.min(0.1, (now - this.lastRenderTime) / 1000));
    this.lastRenderTime = now;

    this.passCells(t);
    this.passTrail(dtSeconds);
    this.passBloom();
    this.passComposite();

    gl.bindVertexArray(null);
  }

  // ─── Passes ─────────────────────────────────────────────────────

  private passCells(t: number): void {
    const gl = this.gl;
    if (!this.sceneFbo || !this.prevTex || !this.currTex || !this.ageTex || !this.infectedTex) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFbo);
    gl.viewport(0, 0, this.canvasW, this.canvasH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.cellProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.prevTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.currTex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.ageTex);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.infectedTex);

    if (this.cellUniforms.u_prev) gl.uniform1i(this.cellUniforms.u_prev, 0);
    if (this.cellUniforms.u_curr) gl.uniform1i(this.cellUniforms.u_curr, 1);
    if (this.cellUniforms.u_age) gl.uniform1i(this.cellUniforms.u_age, 2);
    if (this.cellUniforms.u_infected) gl.uniform1i(this.cellUniforms.u_infected, 3);
    if (this.cellUniforms.u_gridSize) gl.uniform2f(this.cellUniforms.u_gridSize, this.gridW, this.gridH);
    if (this.cellUniforms.u_canvasSize) gl.uniform2f(this.cellUniforms.u_canvasSize, this.canvasW, this.canvasH);
    if (this.cellUniforms.u_t) gl.uniform1f(this.cellUniforms.u_t, Math.max(0, Math.min(1, t)));
    if (this.cellUniforms.u_time) gl.uniform1f(this.cellUniforms.u_time, this.lastRenderTime / 1000);
    if (this.cellUniforms.u_cellRadius) gl.uniform1f(this.cellUniforms.u_cellRadius, this.opts.cellRadius);
    if (this.cellUniforms.u_edgePixels) gl.uniform1f(this.cellUniforms.u_edgePixels, this.opts.cellEdgeSoftness);
    // ageScale: maps ageNorm = age/255 onto gradient input [0..1].
    // We want age = maturationAge to land at 1.0, so scale = 255 / maturationAge.
    if (this.cellUniforms.u_ageScale) gl.uniform1f(this.cellUniforms.u_ageScale, 255 / Math.max(1, this.opts.maturationAge));
    // infectionScale: infection age 1..INFECTION_DEATH_AGE-1 → 0..1.
    // Engine constant is 10, so age 10 maps to 1.0.
    if (this.cellUniforms.u_infectionScale) gl.uniform1f(this.cellUniforms.u_infectionScale, 255 / 10);
    if (this.cellUniforms.u_aliveColor) gl.uniform3f(this.cellUniforms.u_aliveColor, ...this.aliveRgb);
    if (this.cellUniforms.u_ancientColor) gl.uniform3f(this.cellUniforms.u_ancientColor, ...this.ancientRgb);
    if (this.cellUniforms.u_birthTint) gl.uniform3f(this.cellUniforms.u_birthTint, ...this.birthRgb);
    if (this.cellUniforms.u_deathTint) gl.uniform3f(this.cellUniforms.u_deathTint, ...this.deathRgb);
    if (this.cellUniforms.u_infectedColor) gl.uniform3f(this.cellUniforms.u_infectedColor, ...this.infectedRgb);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private passTrail(dtSeconds: number): void {
    const gl = this.gl;
    if (!this.afterimage || !this.sceneTex) return;

    const readTex = this.afterimage.readIdx === 0 ? this.afterimage.texA : this.afterimage.texB;
    const writeFbo = this.afterimage.readIdx === 0 ? this.afterimage.fboB : this.afterimage.fboA;

    gl.bindFramebuffer(gl.FRAMEBUFFER, writeFbo);
    gl.viewport(0, 0, this.canvasW, this.canvasH);
    // No clear — we're writing computed value over.

    gl.useProgram(this.trailProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, readTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTex);

    if (this.trailUniforms.u_prevAfterimage) gl.uniform1i(this.trailUniforms.u_prevAfterimage, 0);
    if (this.trailUniforms.u_scene) gl.uniform1i(this.trailUniforms.u_scene, 1);

    // Decay: per-second factor → per-frame factor via dt.
    // opts.trailDecayPerSecond means "fraction remaining after 1 second".
    // E.g. 0.10 = 10% left after 1 s (very fast decay), 0.5 = half-life ~1 s (slow).
    const remainingPerSec = Math.max(0, Math.min(1, this.opts.trailDecayPerSecond));
    const frameDecay = Math.pow(remainingPerSec, dtSeconds);
    if (this.trailUniforms.u_decay) gl.uniform1f(this.trailUniforms.u_decay, frameDecay);
    if (this.trailUniforms.u_capture) gl.uniform1f(this.trailUniforms.u_capture, 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap.
    this.afterimage.readIdx = this.afterimage.readIdx === 0 ? 1 : 0;
  }

  private passBloom(): void {
    const gl = this.gl;
    if (!this.sceneTex || !this.bloomA || !this.bloomB || !this.bloomFboA || !this.bloomFboB) return;

    gl.useProgram(this.blurProgram);

    // Pass 1: horizontal blur, scene → bloomA, downsampled to bloom resolution.
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

    // Pass 2: vertical blur, bloomA → bloomB.
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
    // The most recently *written* afterimage is the new readIdx after the swap.
    const readTex = this.afterimage.readIdx === 0 ? this.afterimage.texA : this.afterimage.texB;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvasW, this.canvasH);

    gl.useProgram(this.compositeProgram);
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
    if (this.prevTex) gl.deleteTexture(this.prevTex);
    if (this.currTex) gl.deleteTexture(this.currTex);
    if (this.ageTex) gl.deleteTexture(this.ageTex);
    if (this.infectedTex) gl.deleteTexture(this.infectedTex);
    gl.deleteProgram(this.cellProgram);
    gl.deleteProgram(this.trailProgram);
    gl.deleteProgram(this.blurProgram);
    gl.deleteProgram(this.compositeProgram);
    gl.deleteVertexArray(this.quadVao);
  }
}
