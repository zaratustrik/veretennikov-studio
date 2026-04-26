// ─────────────────────────────────────────────────────────────────
// Shared types for the Life engine and renderers.
// ─────────────────────────────────────────────────────────────────

export type Topology = "torus" | "finite";

export interface Rules {
  birth: number[];     // Dead cell becomes alive if neighbour count is in this set.
  survive: number[];   // Alive cell stays alive if neighbour count is in this set.
  topology: Topology;
}

export interface Snapshot {
  readonly width: number;
  readonly height: number;
  // 0 = dead, 1 = alive. Length = width * height. Borrowed reference — do not mutate.
  readonly data: Uint8Array;
  // Per-cell age in generations, capped at 255. 0 for dead cells and just-born.
  // Borrowed reference — do not mutate.
  readonly age: Uint8Array;
  // Per-cell infection age. 0 = healthy. 1..N = generations infected
  // (cell dies when this exceeds INFECTION_DEATH_AGE).
  // Borrowed reference — do not mutate.
  readonly infected: Uint8Array;
  readonly generation: number;
  readonly population: number;
  readonly infectedPopulation: number;
}

export interface CycleInfo {
  period: number;       // How many steps for the pattern to repeat.
  detectedAt: number;   // Generation at which the cycle was confirmed.
}

export type CellValue = 0 | 1;
