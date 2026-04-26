import type { Rules } from "./types";
import { CONWAY } from "./rules";

// ─────────────────────────────────────────────────────────────────
// Pattern handling.
//
// Two responsibilities:
//   1. Parse RLE strings (the canonical Life format used by
//      conwaylife.com / Golly) into a Uint8Array stamp.
//   2. Provide a curated library of built-in patterns ready to drop
//      onto an engine.
//
// RLE grammar (relevant subset):
//
//   #N <name>           — name comment (optional)
//   #C <comment>        — free comment (optional)
//   #O <author>         — author (optional)
//   #P <x> <y>          — origin (optional, ignored here)
//   x = <int>, y = <int>[, rule = <rule>]
//   <body>!
//
//   Body alphabet:
//     b — dead cell
//     o — alive cell
//     $ — end of row
//     !  — end of pattern
//   A run-count integer prefixes any of these:  3o == ooo, 5b == bbbbb.
//   Whitespace and newlines inside the body are ignored.
// ─────────────────────────────────────────────────────────────────

export interface Pattern {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  cells: Uint8Array;     // row-major, length = width × height, 0 or 1.
  rules?: Rules;         // pattern's own rule (defaults to Conway).
  source?: string;       // origin URL for attribution.
}

export interface ParsedRle {
  width: number;
  height: number;
  cells: Uint8Array;
  rules: Rules;
  name?: string;
  comment?: string;
}

// ─── Parser ─────────────────────────────────────────────────────

export function parseRle(input: string): ParsedRle {
  const lines = input.split(/\r?\n/);

  let name: string | undefined;
  const commentLines: string[] = [];
  let header: string | undefined;
  const bodyLines: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) continue;
    if (line.startsWith("#")) {
      const tag = line[1];
      const rest = line.slice(2).trim();
      if (tag === "N") name = rest;
      else if (tag === "C" || tag === "c") commentLines.push(rest);
      continue;
    }
    if (header === undefined && /^x\s*=/.test(line)) {
      header = line;
      continue;
    }
    if (header !== undefined) bodyLines.push(line);
  }

  if (!header) throw new Error("RLE: missing header line (expected `x = N, y = N, …`).");

  const headerMatch = header.match(/x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*([^,\s]+))?/i);
  if (!headerMatch) throw new Error(`RLE: malformed header: ${header}`);

  const width = parseInt(headerMatch[1], 10);
  const height = parseInt(headerMatch[2], 10);
  const ruleStr = headerMatch[3];
  const rules = ruleStr ? parseRuleString(ruleStr) : { ...CONWAY };

  const cells = new Uint8Array(width * height);
  let body = bodyLines.join("");
  // Drop everything after `!`.
  const bang = body.indexOf("!");
  if (bang >= 0) body = body.slice(0, bang);

  let x = 0;
  let y = 0;
  let runStr = "";

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") continue;
    if (ch >= "0" && ch <= "9") {
      runStr += ch;
      continue;
    }
    const run = runStr.length === 0 ? 1 : parseInt(runStr, 10);
    runStr = "";

    if (ch === "$") {
      y += run;
      x = 0;
      continue;
    }
    // Most RLE files use only `b` and `o`. The full Generations-Life
    // alphabet (a, A, B…) is not supported here.
    const alive = ch === "o" || ch === "O" ? 1 : 0;
    if (y >= height) break; // robustness against malformed files
    for (let k = 0; k < run; k++) {
      if (x >= width) break;
      if (alive) cells[y * width + x] = 1;
      x++;
    }
  }

  return {
    width,
    height,
    cells,
    rules,
    name,
    comment: commentLines.length ? commentLines.join("\n") : undefined,
  };
}

// Parse "B3/S23" / "b3s23" / "23/3" (Golly historical) into a Rules object.
export function parseRuleString(input: string): Rules {
  const s = input.trim();

  // Modern form: B…/S…
  let m = s.match(/^[Bb]([0-8]*)\/?[Ss]([0-8]*)$/);
  if (m) {
    return {
      birth: [...m[1]].map((c) => parseInt(c, 10)),
      survive: [...m[2]].map((c) => parseInt(c, 10)),
      topology: "torus",
    };
  }

  // Older Golly form: S/B (digits before slash = survive, after = birth).
  m = s.match(/^([0-8]*)\/([0-8]*)$/);
  if (m) {
    return {
      survive: [...m[1]].map((c) => parseInt(c, 10)),
      birth: [...m[2]].map((c) => parseInt(c, 10)),
      topology: "torus",
    };
  }

  throw new Error(`RLE: unrecognised rule string '${input}'`);
}

// ─── Built-in patterns (hard-coded grids — no RLE parsing needed) ──

function pat(rows: string[]): { width: number; height: number; cells: Uint8Array } {
  const height = rows.length;
  const width = Math.max(...rows.map((r) => r.length));
  const cells = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      cells[y * width + x] = row[x] === "O" || row[x] === "X" || row[x] === "#" ? 1 : 0;
    }
  }
  return { width, height, cells };
}

const GLIDER = pat([
  ".O.",
  "..O",
  "OOO",
]);

const BLINKER = pat(["OOO"]);

const BLOCK = pat([
  "OO",
  "OO",
]);

const BEEHIVE = pat([
  ".OO.",
  "O..O",
  ".OO.",
]);

const PULSAR = pat([
  "..OOO...OOO..",
  ".............",
  "O....O.O....O",
  "O....O.O....O",
  "O....O.O....O",
  "..OOO...OOO..",
  ".............",
  "..OOO...OOO..",
  "O....O.O....O",
  "O....O.O....O",
  "O....O.O....O",
  ".............",
  "..OOO...OOO..",
]);

const PENTADECATHLON = pat([
  "..O....O..",
  "OO.OOOO.OO",
  "..O....O..",
]);

const R_PENTOMINO = pat([
  ".OO",
  "OO.",
  ".O.",
]);

const ACORN = pat([
  ".O.....",
  "...O...",
  "OO..OOO",
]);

const DIEHARD = pat([
  "......O.",
  "OO......",
  ".O...OOO",
]);

// Gosper glider gun — emits a glider every 30 generations (period 30).
const GOSPER_GUN = pat([
  "........................O...........",
  "......................O.O...........",
  "............OO......OO............OO",
  "...........O...O....OO............OO",
  "OO........O.....O...OO..............",
  "OO........O...O.OO....O.O...........",
  "..........O.....O.......O...........",
  "...........O...O....................",
  "............OO......................",
]);

export const PATTERNS: Pattern[] = [
  {
    id: "r-pentomino",
    name: "R-pentomino",
    description: "Пять клеток. Хаос на 1103 поколения, затем стабилизация. Канонический пример эмерджентности.",
    ...R_PENTOMINO,
    source: "https://conwaylife.com/wiki/R-pentomino",
  },
  {
    id: "acorn",
    name: "Acorn",
    description: "Семь клеток. 5206 поколений до стабилизации — рекорд среди мафусаилов в Конвее.",
    ...ACORN,
    source: "https://conwaylife.com/wiki/Acorn",
  },
  {
    id: "diehard",
    name: "Diehard",
    description: "Семь клеток, которые исчезают на 130-м поколении. Имя оправдано.",
    ...DIEHARD,
    source: "https://conwaylife.com/wiki/Die_hard",
  },
  {
    id: "glider",
    name: "Глайдер",
    description: "Корабль. Движется по диагонали со скоростью c/4.",
    ...GLIDER,
    source: "https://conwaylife.com/wiki/Glider",
  },
  {
    id: "blinker",
    name: "Блинкер",
    description: "Простейший осциллятор — период 2.",
    ...BLINKER,
    source: "https://conwaylife.com/wiki/Blinker",
  },
  {
    id: "block",
    name: "Блок",
    description: "Натюрморт. Ничего не происходит — это и есть смысл.",
    ...BLOCK,
    source: "https://conwaylife.com/wiki/Block",
  },
  {
    id: "beehive",
    name: "Улей",
    description: "Натюрморт. Самая частая стабильная форма после блока.",
    ...BEEHIVE,
    source: "https://conwaylife.com/wiki/Beehive",
  },
  {
    id: "pulsar",
    name: "Пульсар",
    description: "Осциллятор. Период 3, симметрия D2h.",
    ...PULSAR,
    source: "https://conwaylife.com/wiki/Pulsar",
  },
  {
    id: "pentadecathlon",
    name: "Пентадекатлон",
    description: "Осциллятор с периодом 15. Самый длинный из «общих».",
    ...PENTADECATHLON,
    source: "https://conwaylife.com/wiki/Pentadecathlon",
  },
  {
    id: "gosper-gun",
    name: "Пушка Госпера",
    description: "Первая известная конструкция бесконечного роста (1970). Производит глайдер каждые 30 поколений.",
    ...GOSPER_GUN,
    source: "https://conwaylife.com/wiki/Gosper_glider_gun",
  },
];

export function findPattern(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
