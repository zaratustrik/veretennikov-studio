"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    // только для dev-инструментов и e2e-проверок
    (window as unknown as Record<string, unknown>).__mcGsap = gsap;
    (window as unknown as Record<string, unknown>).__mcST = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
