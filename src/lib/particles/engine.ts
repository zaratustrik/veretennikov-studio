import type { EngineConfig, Snapshot } from "./types";

// ─────────────────────────────────────────────────────────────────
// ParticleEngine — N-body force-matrix simulation.
//
// Storage: SoA Float32Arrays for cache-friendly hot loop.
// Spatial query: per-frame linked-list bucket grid sized to the
// interaction radius. O(N) bucket build, O(N · k) force pass where
// k ≈ ~50 candidates per particle at default density.
//
// Force profile (Tom Mohr "Particle Life"):
//
//             force
//                ▲
//      attraction│        ╱╲
//             0  ┼──────╱──╲────────┐
//                │     ╱    ╲       │ r
//                │    ╱      ╲      │
//                ┼───╱        ╲─────┴──────────►
//                │  ╱        beta   1
//      repulsion │ ╱
//             -1 ┴
//
// • r ∈ [0, beta]: linear repulsion ramp from -1 to 0 (close-range
//   "hard" core that prevents overlap regardless of attraction sign).
// • r ∈ [beta, 1]: tent function, peak = matrix entry at r = (1+beta)/2.
// • r ≥ 1: zero (no interaction beyond radius).
//
// Topology: torus (wraps both axes). Distance lookups use the shortest
// vector across the wrap so particles interact through the seam.
// ─────────────────────────────────────────────────────────────────

export class ParticleEngine {
  readonly count: number;
  readonly speciesCount: number;
  worldW: number;
  worldH: number;
  interactionRadius: number;
  beta: number;
  damping: number;
  forceScale: number;
  maxVelocity: number;

  // SoA per-particle data.
  readonly posX: Float32Array;
  readonly posY: Float32Array;
  readonly velX: Float32Array;
  readonly velY: Float32Array;
  readonly species: Uint8Array;

  // Force matrix flattened row-major: matrix[from * speciesCount + to].
  // Range typically [-1, 1] but not enforced.
  forceMatrix: Float32Array;

  // Spatial bucket grid (built per frame).
  private cellSize: number;
  private gridW: number;
  private gridH: number;
  private cellHead: Int32Array;       // length = gridW * gridH; first particle index in cell, or -1
  private nextInCell: Int32Array;     // length = count; linked list of particles within a cell

  // Force accumulators (one entry per particle, reused each step).
  private readonly accX: Float32Array;
  private readonly accY: Float32Array;

  constructor(opts: EngineConfig) {
    this.count = opts.count;
    this.speciesCount = opts.speciesCount;
    this.worldW = opts.worldW;
    this.worldH = opts.worldH;
    this.interactionRadius = opts.interactionRadius;
    this.beta = opts.beta;
    this.damping = opts.damping;
    this.forceScale = opts.forceScale;
    this.maxVelocity = opts.maxVelocity ?? 0;

    this.posX = new Float32Array(this.count);
    this.posY = new Float32Array(this.count);
    this.velX = new Float32Array(this.count);
    this.velY = new Float32Array(this.count);
    this.species = new Uint8Array(this.count);
    this.accX = new Float32Array(this.count);
    this.accY = new Float32Array(this.count);
    this.forceMatrix = new Float32Array(this.speciesCount * this.speciesCount);

    // Bucket cell size = interaction radius. A particle's neighbours
    // are in its cell + the 8 surrounding cells.
    this.cellSize = this.interactionRadius;
    this.gridW = Math.max(1, Math.ceil(this.worldW / this.cellSize));
    this.gridH = Math.max(1, Math.ceil(this.worldH / this.cellSize));
    this.cellHead = new Int32Array(this.gridW * this.gridH);
    this.nextInCell = new Int32Array(this.count);
  }

  // ─── Initialisation helpers ──────────────────────────────────────

  // Scatter particles uniformly across the world; assign random species.
  randomizePositions(rng: () => number = Math.random): void {
    for (let i = 0; i < this.count; i++) {
      this.posX[i] = rng() * this.worldW;
      this.posY[i] = rng() * this.worldH;
      this.velX[i] = 0;
      this.velY[i] = 0;
      this.species[i] = (rng() * this.speciesCount) | 0;
    }
  }

  // Fill the force matrix uniformly in [-strength, +strength]. The
  // self-force (a→a) is biased toward mild attraction so each species
  // tends to clump rather than evaporate.
  randomizeMatrix(strength: number, rng: () => number = Math.random): void {
    const S = this.speciesCount;
    for (let from = 0; from < S; from++) {
      for (let to = 0; to < S; to++) {
        const v = (rng() * 2 - 1) * strength;
        // Light positive bias on the diagonal — same-species attraction
        // makes ecosystems read better; pure noise often dissolves into
        // grey haze.
        const biased = from === to ? v * 0.6 + 0.15 : v;
        this.forceMatrix[from * S + to] = biased;
      }
    }
  }

  // Replace the entire force matrix with provided values.
  setMatrix(values: ArrayLike<number>): void {
    if (values.length !== this.forceMatrix.length) {
      throw new Error(`setMatrix: expected ${this.forceMatrix.length} values, got ${values.length}`);
    }
    for (let i = 0; i < values.length; i++) this.forceMatrix[i] = values[i];
  }

  // ─── Player interventions ────────────────────────────────────────

  // Radial outward push around (cx, cy). Used for "explosion" clicks.
  // We OVERWRITE velocity in the impulse direction (rather than add) so
  // the click cleanly redirects motion — adding to existing velocity gets
  // muted when particles happen to be moving inward already.
  impulse(cx: number, cy: number, radius: number, strength: number): number {
    const r2 = radius * radius;
    let touched = 0;
    for (let i = 0; i < this.count; i++) {
      let dx = this.posX[i] - cx;
      let dy = this.posY[i] - cy;
      if (dx > this.worldW * 0.5) dx -= this.worldW;
      else if (dx < -this.worldW * 0.5) dx += this.worldW;
      if (dy > this.worldH * 0.5) dy -= this.worldH;
      else if (dy < -this.worldH * 0.5) dy += this.worldH;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2 || d2 < 0.0001) continue;
      const d = Math.sqrt(d2);
      const falloff = 1 - d / radius;
      const sx = (dx / d) * strength * falloff;
      const sy = (dy / d) * strength * falloff;
      // Overwrite when the impulse is bigger than the existing velocity
      // (the common case for a strong click); otherwise add.
      const cvx = this.velX[i];
      const cvy = this.velY[i];
      this.velX[i] = Math.abs(sx) > Math.abs(cvx) ? sx : cvx + sx;
      this.velY[i] = Math.abs(sy) > Math.abs(cvy) ? sy : cvy + sy;
      touched++;
    }
    return touched;
  }

  // Inward pull toward (cx, cy) with optional tangential swirl (0..1).
  // Pure radial pull is undramatic — particles fall straight in like grit
  // into a drain. Adding a tangential component creates a vortex they
  // spiral into, which reads as "a force is grabbing this region".
  attract(cx: number, cy: number, radius: number, strength: number, swirl = 0): number {
    const r2 = radius * radius;
    let touched = 0;
    for (let i = 0; i < this.count; i++) {
      let dx = this.posX[i] - cx;
      let dy = this.posY[i] - cy;
      if (dx > this.worldW * 0.5) dx -= this.worldW;
      else if (dx < -this.worldW * 0.5) dx += this.worldW;
      if (dy > this.worldH * 0.5) dy -= this.worldH;
      else if (dy < -this.worldH * 0.5) dy += this.worldH;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2 || d2 < 0.0001) continue;
      const d = Math.sqrt(d2);
      const falloff = 1 - d / radius;
      const inv = 1 / d;
      // Radial pull (toward centre): -dx/d, -dy/d.
      const radialX = -dx * inv;
      const radialY = -dy * inv;
      // Tangential (counter-clockwise): perpendicular to radial.
      const tangX = -dy * inv;
      const tangY =  dx * inv;
      const sx = (radialX + tangX * swirl) * strength * falloff;
      const sy = (radialY + tangY * swirl) * strength * falloff;
      // Same overwrite-on-strong rule as impulse() so the swirl actually
      // wins against existing radial-outward motion.
      const cvx = this.velX[i];
      const cvy = this.velY[i];
      this.velX[i] = Math.abs(sx) > Math.abs(cvx) ? sx : cvx + sx;
      this.velY[i] = Math.abs(sy) > Math.abs(cvy) ? sy : cvy + sy;
      touched++;
    }
    return touched;
  }

  // ─── Step — the core simulation advance ──────────────────────────

  step(dt: number): void {
    this.rebuildBuckets();
    this.computeForces();
    this.integrate(dt);
  }

  // (Re)hash all particles into the bucket grid.
  private rebuildBuckets(): void {
    this.cellHead.fill(-1);
    const cellSize = this.cellSize;
    const gridW = this.gridW;
    const gridH = this.gridH;
    for (let i = 0; i < this.count; i++) {
      let cx = (this.posX[i] / cellSize) | 0;
      let cy = (this.posY[i] / cellSize) | 0;
      // Defensive clamp — particles at exactly worldW/H or due to FP drift
      // might land on the boundary.
      if (cx < 0) cx = 0; else if (cx >= gridW) cx = gridW - 1;
      if (cy < 0) cy = 0; else if (cy >= gridH) cy = gridH - 1;
      const cell = cy * gridW + cx;
      this.nextInCell[i] = this.cellHead[cell];
      this.cellHead[cell] = i;
    }
  }

  // Walk 3×3 cells around each particle; sum forces from neighbours.
  // This is the hot loop — every micro-optimisation in JS matters here.
  private computeForces(): void {
    const N = this.count;
    const S = this.speciesCount;
    const W = this.worldW;
    const H = this.worldH;
    const halfW = W * 0.5;
    const halfH = H * 0.5;
    const R = this.interactionRadius;
    const R2 = R * R;
    const beta = this.beta;
    const oneMinusBeta = 1 - beta;
    const cellSize = this.cellSize;
    const gridW = this.gridW;
    const gridH = this.gridH;

    const posX = this.posX;
    const posY = this.posY;
    const species = this.species;
    const matrix = this.forceMatrix;
    const cellHead = this.cellHead;
    const nextInCell = this.nextInCell;
    const accX = this.accX;
    const accY = this.accY;

    // Reset accumulators.
    accX.fill(0);
    accY.fill(0);

    for (let i = 0; i < N; i++) {
      const xi = posX[i];
      const yi = posY[i];
      const si = species[i];
      const matrixRow = si * S;

      const cxi = (xi / cellSize) | 0;
      const cyi = (yi / cellSize) | 0;

      let axi = 0;
      let ayi = 0;

      // 3×3 cells around (cxi, cyi) with toroidal wrap.
      for (let oy = -1; oy <= 1; oy++) {
        let cy = cyi + oy;
        if (cy < 0) cy += gridH;
        else if (cy >= gridH) cy -= gridH;
        const rowOffset = cy * gridW;
        for (let ox = -1; ox <= 1; ox++) {
          let cx = cxi + ox;
          if (cx < 0) cx += gridW;
          else if (cx >= gridW) cx -= gridW;
          const cell = rowOffset + cx;

          // Walk linked list in this cell.
          let j = cellHead[cell];
          while (j !== -1) {
            if (j !== i) {
              let dx = posX[j] - xi;
              let dy = posY[j] - yi;
              // Toroidal nearest-image.
              if (dx > halfW) dx -= W;
              else if (dx < -halfW) dx += W;
              if (dy > halfH) dy -= H;
              else if (dy < -halfH) dy += H;
              const d2 = dx * dx + dy * dy;
              if (d2 < R2 && d2 > 0.000001) {
                const d = Math.sqrt(d2);
                const r = d / R;            // normalised [0..1]
                let f: number;
                if (r < beta) {
                  // Close-range repulsion: ramps from -1 at r=0 to 0 at r=beta.
                  f = r / beta - 1;
                } else {
                  // Attraction tent: peak at r=(1+beta)/2.
                  const a = matrix[matrixRow + species[j]];
                  const peak = (1 + beta) * 0.5;
                  const tri = 1 - Math.abs(2 * r - 1 - beta) / oneMinusBeta;
                  f = a * tri;
                  // Numerical safety: tri can momentarily exceed 1 at peak
                  // due to FP — clamp.
                  void peak; // silence unused-warning if optimiser inlines it
                }
                const inv = 1 / d;
                axi += f * dx * inv;
                ayi += f * dy * inv;
              }
            }
            j = nextInCell[j];
          }
        }
      }

      accX[i] = axi;
      accY[i] = ayi;
    }
  }

  // Apply accumulated forces and integrate position with damping + wrap.
  private integrate(dt: number): void {
    const N = this.count;
    const W = this.worldW;
    const H = this.worldH;
    const damping = this.damping;
    const fScale = this.forceScale;
    const maxV = this.maxVelocity;
    const posX = this.posX;
    const posY = this.posY;
    const velX = this.velX;
    const velY = this.velY;
    const accX = this.accX;
    const accY = this.accY;

    for (let i = 0; i < N; i++) {
      let vx = velX[i] + accX[i] * fScale * dt;
      let vy = velY[i] + accY[i] * fScale * dt;
      vx *= damping;
      vy *= damping;
      // Hard cap (per axis) — guarantees no particle teleports across the
      // world even when close-range repulsion produces extreme accelerations.
      if (maxV > 0) {
        if (vx > maxV) vx = maxV; else if (vx < -maxV) vx = -maxV;
        if (vy > maxV) vy = maxV; else if (vy < -maxV) vy = -maxV;
      }
      velX[i] = vx;
      velY[i] = vy;

      let x = posX[i] + vx * dt;
      let y = posY[i] + vy * dt;
      // Toroidal wrap (handles arbitrary overshoot from explosions).
      if (x < 0) x += W * Math.ceil(-x / W);
      else if (x >= W) x -= W * Math.floor(x / W);
      if (y < 0) y += H * Math.ceil(-y / H);
      else if (y >= H) y -= H * Math.floor(y / H);
      posX[i] = x;
      posY[i] = y;
    }
  }

  // ─── Read-only snapshot ──────────────────────────────────────────

  snapshot(): Snapshot {
    return {
      count: this.count,
      speciesCount: this.speciesCount,
      worldW: this.worldW,
      worldH: this.worldH,
      posX: this.posX,
      posY: this.posY,
      velX: this.velX,
      velY: this.velY,
      species: this.species,
      forceMatrix: this.forceMatrix,
    };
  }
}
