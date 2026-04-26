// ─────────────────────────────────────────────────────────────────
// Force-matrix presets and species palette.
//
// A preset is a (species count, matrix) pair plus an evocative name.
// The matrix is row-major: matrix[from * S + to] = attraction strength.
// Positive values attract, negative repel. Range is conventionally
// [-1, 1] but the engine doesn't enforce it.
//
// Species colours are drawn from the Veretennikov Studio palette
// (cobalt-to-amber gradient) so the simulation reads as part of the
// "Лаборатория эмерджентности" series alongside Conway's Life.
// ─────────────────────────────────────────────────────────────────

export const SPECIES_COLORS_6 = [
  "#1F4DDE", // cobalt
  "#4A7FE8", // steel blue
  "#3FB8B0", // teal
  "#F4F1EA", // warm cream
  "#E89B6F", // amber
  "#D8443A", // brick red
] as const;

export interface Preset {
  id: string;
  name: string;
  description: string;
  speciesCount: number;
  // Row-major matrix; length must equal speciesCount².
  matrix: Float32Array;
}

// Each species:
//  • self-attracts (clusters)
//  • strongly chases the NEXT species in the cycle
//  • repels the PREVIOUS species in the cycle (flees)
// The result is a rotating predator-prey carousel: visually dynamic,
// never settles, never explodes. Verified hand-tuned default.
export const PRESET_CAROUSEL: Preset = {
  id: "carousel",
  name: "Карусель",
  description: "Каждый вид охотится на следующего и убегает от предыдущего. Циклический хищник-жертва.",
  speciesCount: 6,
  matrix: new Float32Array([
    //  to: 0      1      2      3      4      5
    /*0*/  0.30,  0.55, -0.05, -0.30, -0.05,  0.10,
    /*1*/  0.10,  0.30,  0.55, -0.05, -0.30, -0.05,
    /*2*/ -0.05,  0.10,  0.30,  0.55, -0.05, -0.30,
    /*3*/ -0.30, -0.05,  0.10,  0.30,  0.55, -0.05,
    /*4*/ -0.05, -0.30, -0.05,  0.10,  0.30,  0.55,
    /*5*/  0.55, -0.05, -0.30, -0.05,  0.10,  0.30,
  ]),
};

// All species mildly attract themselves; pairs (0↔3), (1↔4), (2↔5) form
// "complementary" attractions. Gives stable bicoloured cells/blobs.
export const PRESET_CELLS: Preset = {
  id: "cells",
  name: "Клетки",
  description: "Виды формируют двуцветные «клетки» с ядром и оболочкой.",
  speciesCount: 6,
  matrix: new Float32Array([
    //  to: 0      1      2      3      4      5
    /*0*/  0.40, -0.10, -0.10,  0.45, -0.20, -0.10,
    /*1*/ -0.10,  0.40, -0.10, -0.10,  0.45, -0.20,
    /*2*/ -0.10, -0.10,  0.40, -0.20, -0.10,  0.45,
    /*3*/  0.45, -0.10, -0.20,  0.40, -0.10, -0.10,
    /*4*/ -0.20,  0.45, -0.10, -0.10,  0.40, -0.10,
    /*5*/ -0.10, -0.20,  0.45, -0.10, -0.10,  0.40,
  ]),
};

export const PRESETS: Preset[] = [PRESET_CAROUSEL, PRESET_CELLS];

// ─── Seeded PRNG (Mulberry32) ────────────────────────────────────
// Tiny, fast, deterministic. Good enough for procedural setup; we
// don't need cryptographic randomness, only reproducibility.
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hand-chosen seed that gives a pleasingly distributed initial state
// when used with PRESET_CAROUSEL on a 6-species, 5000-particle world.
// Re-roll if the simulation is looking dead — this is a curated value,
// not derived.
export const DEFAULT_POSITION_SEED = 0xC0BA17;
