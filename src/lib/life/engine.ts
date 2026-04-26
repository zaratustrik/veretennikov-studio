import type { CellValue, CycleInfo, Rules, Snapshot } from "./types";
import { CONWAY, packRule } from "./rules";

// ─── Infection mechanic constants ───────────────────────────────
// An infected cell dies once it has been infected for this many
// generations, regardless of Conway survival rules. Tuned so the wave
// is visible for ~3–4 seconds at 12 ticks/sec rather than vanishing
// in half a second.
export const INFECTION_DEATH_AGE = 10;
// Per-neighbour spread probability. With 1 infected neighbour this is
// the chance of contracting; with k neighbours it is 1 − (1−p)^k.
export const INFECTION_SPREAD_PROB = 0.5;

// ─────────────────────────────────────────────────────────────────
// LifeEngine — pure simulation.
//
// Storage: two Uint8Array buffers, one byte per cell (0 = dead, 1 = alive).
// We swap buffer pointers each step so renderer can read both prev and curr
// for smooth interpolation.
//
// Why one byte per cell instead of bitboard:
//   1. Maps directly to a WebGL R8 texture (no unpacking step on upload).
//   2. Inner loop is just integer-addressed reads — no shifts/masks.
//   3. For our target sizes (≤ 600×600 = 360 KB) memory is irrelevant.
//
// The class knows nothing about time, frames, or DOM. The host loop calls
// step() when a generation should advance; rendering interpolates between
// the snapshot returned by prev() and the one returned by curr().
// ─────────────────────────────────────────────────────────────────

export interface LifeEngineOptions {
  width: number;
  height: number;
  rules?: Rules;
  cycleHistorySize?: number;
}

export class LifeEngine {
  readonly width: number;
  readonly height: number;

  rules: Rules;

  generation = 0;
  population = 0;
  infectedPopulation = 0;

  // Two flat buffers; `currIdx` says which one is the current state.
  private readonly bufA: Uint8Array;
  private readonly bufB: Uint8Array;
  private currIdx: 0 | 1 = 0;

  // Last "prev" generation (the one before currIdx). At construction time
  // there's no prior generation, so prevBuf === currBuf — interpolation
  // will just produce a static frame.
  private prevIdx: 0 | 1 = 0;

  // Per-cell age in generations, capped at 255 so it fits an R8 texture.
  // Mirrors `currBuf`: age[i] is meaningful only when currBuf[i] === 1.
  // Reset to 0 when a cell is born or when manual edits occur.
  private readonly ageBuf: Uint8Array;

  // Per-cell infection age. 0 = healthy. 1..INFECTION_DEATH_AGE-1 = infected.
  // We double-buffer because infection spread reads neighbours' previous
  // infection state — in-place updates would race within a single step.
  private readonly infA: Uint8Array;
  private readonly infB: Uint8Array;

  // Generations at which prev/curr were captured (for renderer timing).
  private prevGeneration = 0;
  private currGeneration = 0;

  // Cycle detection: ring buffer of recent state hashes.
  private readonly hashHistory: number[];
  private readonly hashHistorySize: number;
  private hashHead = 0;

  private packedBirth: number;
  private packedSurvive: number;

  constructor(opts: LifeEngineOptions) {
    if (opts.width <= 0 || opts.height <= 0) {
      throw new Error(`LifeEngine: width and height must be positive (got ${opts.width}×${opts.height})`);
    }
    this.width = opts.width;
    this.height = opts.height;
    this.rules = opts.rules ?? { ...CONWAY };

    const cells = this.width * this.height;
    this.bufA = new Uint8Array(cells);
    this.bufB = new Uint8Array(cells);
    this.ageBuf = new Uint8Array(cells);
    this.infA = new Uint8Array(cells);
    this.infB = new Uint8Array(cells);

    this.hashHistorySize = opts.cycleHistorySize ?? 64;
    this.hashHistory = new Array(this.hashHistorySize).fill(0);

    const packed = packRule(this.rules);
    this.packedBirth = packed.birthMask;
    this.packedSurvive = packed.surviveMask;
  }

  // ─── Buffer accessors ────────────────────────────────────────────

  private get currBuf(): Uint8Array {
    return this.currIdx === 0 ? this.bufA : this.bufB;
  }

  private get prevBuf(): Uint8Array {
    return this.prevIdx === 0 ? this.bufA : this.bufB;
  }

  private get currInfBuf(): Uint8Array {
    return this.currIdx === 0 ? this.infA : this.infB;
  }

  // ─── Public read API ─────────────────────────────────────────────

  curr(): Snapshot {
    return {
      width: this.width,
      height: this.height,
      data: this.currBuf,
      age: this.ageBuf,
      infected: this.currInfBuf,
      generation: this.currGeneration,
      population: this.population,
      infectedPopulation: this.infectedPopulation,
    };
  }

  prev(): Snapshot {
    return {
      width: this.width,
      height: this.height,
      data: this.prevBuf,
      age: this.ageBuf,
      // Same single infection mirror — we don't track prev infection state
      // separately. Visual transition is hard at the tick boundary, but
      // bloom + trail smooth it out anyway.
      infected: this.currInfBuf,
      generation: this.prevGeneration,
      population: this.population,
      infectedPopulation: this.infectedPopulation,
    };
  }

  get(x: number, y: number): CellValue {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.currBuf[y * this.width + x] as CellValue;
  }

  // ─── Public write API (operates on `curr`; does not advance generation) ──

  setRules(rules: Rules): void {
    this.rules = rules;
    const packed = packRule(rules);
    this.packedBirth = packed.birthMask;
    this.packedSurvive = packed.surviveMask;
    this.resetCycleHistory();
  }

  set(x: number, y: number, alive: CellValue): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    const idx = y * this.width + x;
    const before = buf[idx];
    if (before === alive) return;
    buf[idx] = alive;
    this.ageBuf[idx] = 0;
    if (inf[idx]) {
      this.infectedPopulation--;
      inf[idx] = 0;
    }
    this.population += alive ? 1 : -1;
    this.resetCycleHistory();
  }

  toggle(x: number, y: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    const idx = y * this.width + x;
    if (buf[idx]) {
      buf[idx] = 0;
      this.population--;
    } else {
      buf[idx] = 1;
      this.population++;
    }
    this.ageBuf[idx] = 0;
    if (inf[idx]) {
      this.infectedPopulation--;
      inf[idx] = 0;
    }
    this.resetCycleHistory();
  }

  clear(): void {
    this.bufA.fill(0);
    this.bufB.fill(0);
    this.ageBuf.fill(0);
    this.infA.fill(0);
    this.infB.fill(0);
    this.population = 0;
    this.infectedPopulation = 0;
    this.generation = 0;
    this.prevGeneration = 0;
    this.currGeneration = 0;
    this.resetCycleHistory();
  }

  randomize(density = 0.3, rng: () => number = Math.random): void {
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    let pop = 0;
    for (let i = 0; i < buf.length; i++) {
      const alive = rng() < density ? 1 : 0;
      buf[i] = alive;
      this.ageBuf[i] = 0;
      inf[i] = 0;
      pop += alive;
    }
    this.population = pop;
    this.infectedPopulation = 0;
    this.resetCycleHistory();
  }

  // Stamp a 2D rectangle of cells onto the current buffer at offset (ox, oy).
  // `cells` is row-major, length = w * h, values 0 or 1.
  stamp(cells: Uint8Array, w: number, h: number, ox: number, oy: number): void {
    if (cells.length !== w * h) {
      throw new Error(`stamp: cells length ${cells.length} doesn't match ${w}×${h}`);
    }
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    let pop = this.population;
    let infPop = this.infectedPopulation;
    for (let y = 0; y < h; y++) {
      const ty = oy + y;
      if (ty < 0 || ty >= this.height) continue;
      for (let x = 0; x < w; x++) {
        const tx = ox + x;
        if (tx < 0 || tx >= this.width) continue;
        const src = cells[y * w + x] ? 1 : 0;
        const flatIdx = ty * this.width + tx;
        const dst = buf[flatIdx];
        if (src === dst) continue;
        buf[flatIdx] = src as CellValue;
        this.ageBuf[flatIdx] = 0;
        if (inf[flatIdx]) {
          infPop--;
          inf[flatIdx] = 0;
        }
        pop += src ? 1 : -1;
      }
    }
    this.population = pop;
    this.infectedPopulation = infPop;
    this.resetCycleHistory();
  }

  // ─── Player interventions ────────────────────────────────────────

  // Infect roughly `percent` of currently-alive, healthy cells. The new
  // infections start at age 1 and will run their course over the next
  // INFECTION_DEATH_AGE generations (with neighbour spread along the way).
  infect(percent: number, rng: () => number = Math.random): number {
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    let added = 0;
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] && inf[i] === 0 && rng() < percent) {
        inf[i] = 1;
        added++;
      }
    }
    this.infectedPopulation += added;
    return added;
  }

  // Drop a circular cluster of new live cells centred at (cx, cy). Cells
  // within `radius` are populated with `density` probability. Existing
  // cells inside the radius are kept and have their age reset to 0.
  impulse(
    cx: number,
    cy: number,
    radius: number,
    density: number,
    rng: () => number = Math.random,
  ): number {
    const buf = this.currBuf;
    const inf = this.currInfBuf;
    const age = this.ageBuf;
    const r2 = radius * radius;
    let added = 0;
    let infCleared = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      const yy = cy + dy;
      if (yy < 0 || yy >= this.height) continue;
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const xx = cx + dx;
        if (xx < 0 || xx >= this.width) continue;
        if (rng() >= density) continue;
        const idx = yy * this.width + xx;
        if (!buf[idx]) {
          buf[idx] = 1;
          added++;
        }
        age[idx] = 0;
        if (inf[idx]) {
          inf[idx] = 0;
          infCleared++;
        }
      }
    }
    this.population += added;
    this.infectedPopulation -= infCleared;
    this.resetCycleHistory();
    return added;
  }

  // ─── Step — the core generation advance ──────────────────────────

  step(rng: () => number = Math.random): void {
    const w = this.width;
    const h = this.height;
    const src = this.currBuf;
    const dst = this.currIdx === 0 ? this.bufB : this.bufA;
    const srcInf = this.currInfBuf;
    const dstInf = this.currIdx === 0 ? this.infB : this.infA;
    const birthMask = this.packedBirth;
    const surviveMask = this.packedSurvive;
    const torus = this.rules.topology === "torus";

    let pop = 0;

    // Hot loop. We split into interior (no boundary checks) and edges
    // (with topology-dependent wrap or clamp). On a 300×300 grid the
    // interior is 88 804 of 90 000 cells — ~99% take the fast path.

    // ─── Interior: y in [1, h-2], x in [1, w-2] ───────────────────
    for (let y = 1; y < h - 1; y++) {
      const above = (y - 1) * w;
      const self = y * w;
      const below = (y + 1) * w;
      for (let x = 1; x < w - 1; x++) {
        const xL = x - 1;
        const xR = x + 1;
        const n =
          src[above + xL] + src[above + x] + src[above + xR] +
          src[self  + xL]                  + src[self  + xR] +
          src[below + xL] + src[below + x] + src[below + xR];
        const alive = src[self + x];
        // Lookup: bit n in the appropriate mask says "yes, alive next gen".
        const nextAlive = ((alive ? surviveMask : birthMask) >>> n) & 1;
        dst[self + x] = nextAlive;
        pop += nextAlive;
      }
    }

    // ─── Edge cells (rows 0 and h-1, columns 0 and w-1) ───────────
    // We only process cells that weren't covered by the interior loop.
    const isEdgeRow = (y: number) => y === 0 || y === h - 1;
    const isEdgeCol = (x: number) => x === 0 || x === w - 1;

    for (let y = 0; y < h; y++) {
      const yEdge = isEdgeRow(y);
      const yAbove = y - 1;
      const yBelow = y + 1;
      for (let x = 0; x < w; x++) {
        if (!yEdge && !isEdgeCol(x)) continue; // interior already done
        const xLeft = x - 1;
        const xRight = x + 1;

        let n = 0;
        // Manually unroll 8 neighbours with topology resolution.
        for (let dy = -1; dy <= 1; dy++) {
          let yy = y + dy;
          if (yy < 0)        yy = torus ? h - 1 : -1;
          else if (yy >= h)  yy = torus ? 0     : -1;
          if (yy < 0) continue;
          const row = yy * w;
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            let xx = x + dx;
            if (xx < 0)       xx = torus ? w - 1 : -1;
            else if (xx >= w) xx = torus ? 0     : -1;
            if (xx < 0) continue;
            n += src[row + xx];
          }
        }

        const alive = src[y * w + x];
        const nextAlive = ((alive ? surviveMask : birthMask) >>> n) & 1;
        dst[y * w + x] = nextAlive;
        pop += nextAlive;
      }
    }

    // ─── Infection update ─────────────────────────────────────────
    // Reads `src` cells, `srcInf` infection state, possibly mutates `dst`
    // (cells dying of disease override Conway survival). Skipped fast
    // when no infections exist anywhere.
    let infPop = 0;
    if (this.infectedPopulation > 0) {
      const cells = w * h;
      for (let i = 0; i < cells; i++) {
        if (!dst[i]) {
          dstInf[i] = 0;
          continue;
        }
        const wasInfected = src[i] && srcInf[i] > 0;
        if (wasInfected) {
          const newAge = srcInf[i] + 1;
          if (newAge >= INFECTION_DEATH_AGE) {
            // Override Conway: cell dies of disease.
            dst[i] = 0;
            dstInf[i] = 0;
            pop--;
          } else {
            dstInf[i] = newAge;
            infPop++;
          }
        } else {
          // Cell is alive in dst but was not infected last gen.
          // It may catch infection from infected neighbours in src.
          const x = i % w;
          const y = (i - x) / w;
          let infectedNbrs = 0;
          for (let dy = -1; dy <= 1; dy++) {
            let yy = y + dy;
            if (yy < 0)        yy = torus ? h - 1 : -1;
            else if (yy >= h)  yy = torus ? 0     : -1;
            if (yy < 0) continue;
            const row = yy * w;
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              let xx = x + dx;
              if (xx < 0)       xx = torus ? w - 1 : -1;
              else if (xx >= w) xx = torus ? 0     : -1;
              if (xx < 0) continue;
              const ni = row + xx;
              if (src[ni] && srcInf[ni] > 0) infectedNbrs++;
            }
          }
          if (infectedNbrs > 0) {
            // P(infected) = 1 − (1 − p)^k where k = infected neighbour count.
            const pNoInfect = Math.pow(1 - INFECTION_SPREAD_PROB, infectedNbrs);
            if (rng() < 1 - pNoInfect) {
              dstInf[i] = 1;
              infPop++;
            } else {
              dstInf[i] = 0;
            }
          } else {
            dstInf[i] = 0;
          }
        }
      }
    } else {
      // No active epidemic — make sure the destination buffer is clean.
      // Cheap because we only do this when there's no work to do anyway.
      dstInf.fill(0);
    }

    // ─── Update age buffer to mirror the new state ────────────────
    // Alive in new gen → age = min(prev age + 1, 255). Just-born cells
    // were dead before, so their previous age is already 0; they end up
    // with age 1 here, which represents their first generation alive.
    // Dead cells get age = 0 unconditionally.
    // Runs *after* infection because cells that just died of disease
    // were just demoted to dst[i] = 0 above.
    const age = this.ageBuf;
    const cells = w * h;
    for (let i = 0; i < cells; i++) {
      if (dst[i]) {
        const a = age[i];
        age[i] = a < 255 ? a + 1 : 255;
      } else {
        age[i] = 0;
      }
    }

    // ─── Swap buffer pointers; advance generation counters ────────
    this.prevIdx = this.currIdx;
    this.currIdx = this.currIdx === 0 ? 1 : 0;
    this.prevGeneration = this.currGeneration;
    this.currGeneration = ++this.generation;
    this.population = pop;
    this.infectedPopulation = infPop;

    this.recordHash(dst);
  }

  // ─── Cycle detection ─────────────────────────────────────────────

  private resetCycleHistory(): void {
    this.hashHistory.fill(0);
    this.hashHead = 0;
  }

  private recordHash(buf: Uint8Array): void {
    // FNV-1a over the buffer. Cheap, decent distribution. Good enough for
    // detecting period equality — we don't need cryptographic strength.
    let h = 0x811c9dc5;
    for (let i = 0; i < buf.length; i++) {
      h ^= buf[i];
      h = Math.imul(h, 0x01000193);
    }
    this.hashHistory[this.hashHead] = h >>> 0;
    this.hashHead = (this.hashHead + 1) % this.hashHistorySize;
  }

  // Returns the period if the current state equals one of the last N states.
  // Period 1 = still life; period 2 = blinker; etc.
  detectCycle(): CycleInfo | null {
    const head = this.hashHead === 0 ? this.hashHistorySize - 1 : this.hashHead - 1;
    const currHash = this.hashHistory[head];
    if (currHash === 0 && this.generation > 0) return null;
    for (let p = 1; p < this.hashHistorySize; p++) {
      const idx = (head - p + this.hashHistorySize) % this.hashHistorySize;
      if (this.hashHistory[idx] === currHash && this.generation >= p) {
        return { period: p, detectedAt: this.generation };
      }
    }
    return null;
  }
}
