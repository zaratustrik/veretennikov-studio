// ─────────────────────────────────────────────────────────────────
// Tiny WebGL2 helpers — shader compile, program link, FBO creation.
// Kept dependency-free so the renderer remains a single import.
// ─────────────────────────────────────────────────────────────────

export function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
  label: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`compileShader[${label}]: createShader returned null`);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`compileShader[${label}] failed:\n${log}\n\nSource:\n${source}`);
  }
  return shader;
}

export function linkProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
  label: string,
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource, `${label}.vs`);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource, `${label}.fs`);
  const program = gl.createProgram();
  if (!program) throw new Error(`linkProgram[${label}]: createProgram returned null`);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  // Shaders can be deleted once attached to a linked program.
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`linkProgram[${label}] failed:\n${log}`);
  }
  return program;
}

export interface UniformMap {
  [name: string]: WebGLUniformLocation;
}

// Pull all uniform locations for a program into a name→location map.
export function collectUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: readonly string[],
): UniformMap {
  const map: UniformMap = {};
  for (const name of names) {
    const loc = gl.getUniformLocation(program, name);
    if (!loc) {
      // Not throwing — uniforms can be optimised out by the driver.
      // We just store nothing; calls that try to set a missing uniform are no-ops.
      continue;
    }
    map[name] = loc;
  }
  return map;
}

// ─── Single-channel R8 texture ──────────────────────────────────

export function createR8Texture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  filtering: GLenum = gl.NEAREST,
): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("createR8Texture: createTexture returned null");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function uploadR8Texture(
  gl: WebGL2RenderingContext,
  tex: WebGLTexture,
  width: number,
  height: number,
  data: Uint8Array,
): void {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RED, gl.UNSIGNED_BYTE, data);
}

// ─── RGBA half-float texture (used for bloom / afterimage buffers) ──
// We use HALF_FLOAT for HDR-ish glow without banding. WebGL2 supports
// EXT_color_buffer_half_float by default in most browsers; we don't
// gate on the extension because WebGL2 implementations universally
// support rendering to half-float in practice.

export function createRGBA16FTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  filtering: GLenum = gl.LINEAR,
): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("createRGBA16FTexture: createTexture returned null");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

// ─── Framebuffer wrapping a texture ─────────────────────────────

export function createFramebuffer(
  gl: WebGL2RenderingContext,
  tex: WebGLTexture,
): WebGLFramebuffer {
  const fbo = gl.createFramebuffer();
  if (!fbo) throw new Error("createFramebuffer: createFramebuffer returned null");
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`createFramebuffer: incomplete (status 0x${status.toString(16)})`);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return fbo;
}

// ─── Fullscreen quad geometry (a single VAO reused by all passes) ──

export function createFullscreenQuad(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error("createFullscreenQuad: createVertexArray returned null");
  gl.bindVertexArray(vao);

  const buf = gl.createBuffer();
  if (!buf) throw new Error("createFullscreenQuad: createBuffer returned null");
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Two triangles covering [-1, 1] in both axes.
  const verts = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  // Attribute location 0 is conventional for position.
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  return vao;
}

// ─── Hex → 0..1 RGB triple ──────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) throw new Error(`hexToRgb: bad hex '${hex}'`);
  const n = parseInt(m[1], 16);
  return [
    ((n >> 16) & 0xff) / 255,
    ((n >> 8) & 0xff) / 255,
    (n & 0xff) / 255,
  ];
}
