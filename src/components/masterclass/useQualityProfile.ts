"use client";

import { useEffect, useState } from "react";

export type QualityProfile = {
  /** false до первого клиентского рендера — SSR-безопасно */
  ready: boolean;
  reducedMotion: boolean;
  mobile: boolean;
  webgl: boolean;
  /** сводный флаг облегчённого режима */
  lite: boolean;
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

export function useQualityProfile(): QualityProfile {
  const [profile, setProfile] = useState<QualityProfile>({
    ready: false,
    reducedMotion: false,
    mobile: false,
    webgl: true,
    lite: false,
  });

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 900px)");

    const compute = () => {
      const reducedMotion = mqReduced.matches;
      const mobile = mqMobile.matches;
      const webgl = detectWebGL();
      setProfile({
        ready: true,
        reducedMotion,
        mobile,
        webgl,
        lite: reducedMotion || !webgl,
      });
    };

    compute();
    mqReduced.addEventListener("change", compute);
    mqMobile.addEventListener("change", compute);
    return () => {
      mqReduced.removeEventListener("change", compute);
      mqMobile.removeEventListener("change", compute);
    };
  }, []);

  return profile;
}
