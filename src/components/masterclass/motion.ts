/** Единые motion-токены мастер-класса (см. ТЗ §6.4). */
export const motion = {
  instant: 0.12,
  fast: 0.24,
  base: 0.45,
  slow: 0.8,
  cinematic: 1.2,
  staggerTight: 0.045,
  staggerBase: 0.09,
  scrubSoft: 0.7,
  scrubCinematic: 1.1,
} as const;

export const ease = {
  ui: "power2.out",
  major: "power3.out",
  state: "power2.inOut",
  accent: "expo.out",
} as const;
