import type { Rules } from "./types";

// ─────────────────────────────────────────────────────────────────
// Standard rule presets in B/S notation.
// B = neighbour counts that birth a dead cell.
// S = neighbour counts that keep a live cell alive.
// ─────────────────────────────────────────────────────────────────

export const CONWAY: Rules = {
  birth: [3],
  survive: [2, 3],
  topology: "torus",
};

export const HIGHLIFE: Rules = {
  birth: [3, 6],
  survive: [2, 3],
  topology: "torus",
};

export const DAY_NIGHT: Rules = {
  birth: [3, 6, 7, 8],
  survive: [3, 4, 6, 7, 8],
  topology: "torus",
};

export const SEEDS: Rules = {
  birth: [2],
  survive: [],
  topology: "torus",
};

export const DIAMOEBA: Rules = {
  birth: [3, 5, 6, 7, 8],
  survive: [5, 6, 7, 8],
  topology: "torus",
};

export const RULE_PRESETS = {
  conway: CONWAY,
  highlife: HIGHLIFE,
  daynight: DAY_NIGHT,
  seeds: SEEDS,
  diamoeba: DIAMOEBA,
} as const;

export type RulePresetKey = keyof typeof RULE_PRESETS;

// Pack a rule's birth/survive arrays into bitmasks for fast lookup
// during the inner step loop. Bit n set ⇒ neighbour count n triggers the rule.
export function packRule(rules: Rules): { birthMask: number; surviveMask: number } {
  let birthMask = 0;
  for (const n of rules.birth) birthMask |= 1 << n;
  let surviveMask = 0;
  for (const n of rules.survive) surviveMask |= 1 << n;
  return { birthMask, surviveMask };
}

// Format a rule in canonical B/S notation, e.g. "B3/S23".
export function formatRule(rules: Rules): string {
  const b = [...rules.birth].sort((a, b) => a - b).join("");
  const s = [...rules.survive].sort((a, b) => a - b).join("");
  return `B${b}/S${s}`;
}
