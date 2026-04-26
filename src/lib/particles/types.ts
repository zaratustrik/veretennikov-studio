// ─────────────────────────────────────────────────────────────────
// Shared types for the Particle Life engine and renderer.
// ─────────────────────────────────────────────────────────────────

export interface Snapshot {
  readonly count: number;
  readonly speciesCount: number;
  readonly worldW: number;
  readonly worldH: number;
  // SoA per-particle data. Borrowed references — do not mutate.
  readonly posX: Float32Array;
  readonly posY: Float32Array;
  readonly velX: Float32Array;
  readonly velY: Float32Array;
  readonly species: Uint8Array;
  // Force matrix flattened: matrix[from * speciesCount + to].
  readonly forceMatrix: Float32Array;
}

export interface ForceProfile {
  // Close-range repulsion zone width (relative to interactionRadius).
  // Inside this zone the force is purely repulsive regardless of matrix.
  beta: number;
}

export interface EngineConfig {
  count: number;
  speciesCount: number;
  worldW: number;
  worldH: number;
  interactionRadius: number;
  beta: number;
  damping: number;
  forceScale: number;
  // Hard cap on per-axis velocity (in canvas pixels per integration step).
  // Prevents close-range repulsion from launching particles ballistically.
  // Set to 0 to disable.
  maxVelocity?: number;
  topology?: "torus" | "finite";
}
