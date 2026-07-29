"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import HeroNetwork from "./three/HeroNetwork";

/**
 * Единственный WebGL-canvas страницы. Закреплён в фоне,
 * не пересоздаётся между сценами; при скрытой вкладке рендер останавливается
 * (frameloop управляется visibilitychange).
 */
export default function MasterclassCanvas() {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="mc-canvas-host" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
          });
        }}
      >
        <HeroNetwork />
      </Canvas>
    </div>
  );
}
