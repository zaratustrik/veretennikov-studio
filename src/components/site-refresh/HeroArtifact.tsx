"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroArtifact() {
  const host = useRef<HTMLDivElement>(null);
  const control = useRef({ x: 0, y: 0, open: false, paused: false });
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("./sculptureScene").then(({ mountSculpture }) => {
      if (!cancelled && host.current) dispose = mountSculpture(host.current, control.current);
    }).catch(() => { /* The static silhouette remains available. */ });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return <div className="sr-sculpture">
    <div ref={host} className="sr-sculpture-canvas" aria-hidden="true">
      <svg className="sr-sculpture-fallback" viewBox="0 0 500 500" fill="none">
        <ellipse cx="250" cy="250" rx="190" ry="145" stroke="#344f89" strokeWidth="5" transform="rotate(12 250 250)" />
        <ellipse cx="250" cy="250" rx="140" ry="112" stroke="#647987" strokeWidth="4" transform="rotate(-8 250 250)" />
        <ellipse cx="250" cy="250" rx="96" ry="80" stroke="#879ab5" strokeWidth="2" opacity=".35" transform="rotate(7 250 250)" />
        <ellipse cx="250" cy="250" rx="62" ry="54" stroke="#a4b1c2" strokeWidth="1.5" opacity=".28" transform="rotate(-5 250 250)" />
      </svg>
    </div>
    <button className="sr-sculpture-touch" type="button" aria-label="Раскрыть переплетение" aria-pressed={open}
      onPointerMove={event => {
        if (event.pointerType !== "mouse") return;
        const r = event.currentTarget.getBoundingClientRect();
        control.current.x = (event.clientX-r.left)/r.width-.5;
        control.current.y = (event.clientY-r.top)/r.height-.5;
      }}
      onPointerLeave={() => { control.current.x = 0; control.current.y = 0; }}
      onClick={() => { control.current.open = !open; setOpen(!open); }} />
    <button
      className="sr-sculpture-pause"
      type="button"
      aria-label={paused ? "Продолжить движение" : "Остановить движение"}
      aria-pressed={paused}
      data-paused={paused}
      onClick={() => { control.current.paused = !paused; setPaused(!paused); }}
    />
  </div>;
}
