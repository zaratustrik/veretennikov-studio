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
        <path d="M250 90C470 90 430 420 250 340S30 90 250 90ZM250 410C30 410 70 80 250 160S470 410 250 410Z" stroke="#72849b" strokeWidth="16"/>
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
