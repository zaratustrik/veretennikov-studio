"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "../sceneStore";

const POINT_COUNT = 150;
const LINK_DISTANCE = 1.35;

/**
 * Процедурная «мягкая сеть» hero-сцены: точки в широкой ленте,
 * линии по близости, редкие световые импульсы. Без внешних моделей.
 */
export default function HeroNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { positions, basePositions, linePositions, linePairs, sizes } =
    useMemo(() => {
      const rng = mulberry32(20260729);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        // широкая лента, чуть плотнее к правой части (визуальная зона)
        const x = (rng() * 2 - 1) * 6.4 + rng() * 1.4;
        const y = (rng() * 2 - 1) * 2.4 + Math.sin(x * 0.55) * 0.55;
        const z = (rng() * 2 - 1) * 1.6;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const positions = new Float32Array(POINT_COUNT * 3);
      const sizes = new Float32Array(POINT_COUNT);
      pts.forEach((p, i) => {
        positions.set([p.x, p.y, p.z], i * 3);
        sizes[i] = 0.5 + rng() * 1.4;
      });

      const pairs: Array<[number, number]> = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        for (let j = i + 1; j < POINT_COUNT; j++) {
          if (pts[i].distanceTo(pts[j]) < LINK_DISTANCE) pairs.push([i, j]);
        }
      }
      const linePositions = new Float32Array(pairs.length * 6);
      pairs.forEach(([a, b], k) => {
        linePositions.set(
          [pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z],
          k * 6,
        );
      });
      return {
        positions,
        basePositions: positions.slice(),
        linePositions,
        linePairs: pairs,
        sizes,
      };
    }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const points = pointsRef.current;
    const lines = linesRef.current;
    const group = groupRef.current;
    if (!points || !lines || !group) return;

    const progress = sceneStore.heroProgress;
    const fade = sceneStore.fade;

    // сеть полностью погашена (середина истории) — не тратим GPU/CPU
    if (fade <= 0.01) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // медленный дрейф точек
    const posAttr = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < POINT_COUNT; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      // при скролле сеть слегка «расходится» в стороны от центра
      const spread = 1 + progress * 0.35;
      arr[i * 3] = bx * spread + Math.sin(t * 0.25 + i * 1.7) * 0.06;
      arr[i * 3 + 1] =
        by + Math.cos(t * 0.21 + i * 2.3) * 0.05 + progress * 0.6;
    }
    posAttr.needsUpdate = true;

    // линии следуют за точками
    const lineAttr = lines.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const larr = lineAttr.array as Float32Array;
    linePairs.forEach(([a, b], k) => {
      larr[k * 6] = arr[a * 3];
      larr[k * 6 + 1] = arr[a * 3 + 1];
      larr[k * 6 + 2] = arr[a * 3 + 2];
      larr[k * 6 + 3] = arr[b * 3];
      larr[k * 6 + 4] = arr[b * 3 + 1];
      larr[k * 6 + 5] = arr[b * 3 + 2];
    });
    lineAttr.needsUpdate = true;

    const pm = points.material as THREE.PointsMaterial;
    const lm = lines.material as THREE.LineBasicMaterial;
    pm.opacity = (0.85 - progress * 0.35) * fade;
    lm.opacity = (0.16 + Math.sin(t * 0.6) * 0.03 - progress * 0.08) * fade;

    // микро-dolly камеры при скролле
    group.position.z = progress * 0.9;
    group.position.y = -progress * 0.4;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          color="#6fd8f2"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3fa9d8"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/** детерминированный PRNG, чтобы сцена была воспроизводимой */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
