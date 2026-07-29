"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sceneOrder, type SceneId } from "./content.ru";
import { track } from "./analytics";

export type PresenterState = {
  presenting: boolean;
  notesOpen: boolean;
  snap: boolean;
  sceneIdx: number;
  sceneId: SceneId;
  enter: () => void;
  exit: () => void;
  toggleNotes: () => void;
  toggleSnap: () => void;
  toggleFullscreen: () => void;
  go: (idx: number) => void;
  next: () => void;
  prev: () => void;
};

function sceneTops(): Array<{ id: SceneId; top: number }> {
  return sceneOrder
    .map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return { id, top: el.getBoundingClientRect().top + window.scrollY };
    })
    .filter((x): x is { id: SceneId; top: number } => x !== null)
    .sort((a, b) => a.top - b.top);
}

export function usePresenter(reducedMotion: boolean): PresenterState {
  const [presenting, setPresenting] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [snap, setSnap] = useState(true);
  const [sceneIdx, setSceneIdx] = useState(0);
  const snapTimer = useRef<number | null>(null);
  const autoScrolling = useRef(false);

  // вход по URL: ?presenter=1 (поддерживаем и present=1), заметки: &notes=1
  useEffect(() => {
    const t = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("presenter") === "1" || params.get("present") === "1") {
        setPresenting(true);
        track("mc_presenter_open");
      }
      if (params.get("notes") === "1") setNotesOpen(true);
      const hash = window.location.hash.slice(1);
      if (hash && sceneOrder.includes(hash as SceneId)) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "auto" });
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // отслеживание текущей сцены
  useEffect(() => {
    const onScroll = () => {
      if (autoScrolling.current) return;
      const tops = sceneTops();
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      tops.forEach((t, i) => {
        if (t.top <= y) idx = i;
      });
      setSceneIdx((old) => (old === idx ? old : idx));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // hash текущей сцены в режиме ведущего
  useEffect(() => {
    if (!presenting) return;
    const id = sceneOrder[sceneIdx];
    history.replaceState(null, "", `#${id}`);
  }, [presenting, sceneIdx]);

  const go = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(sceneOrder.length - 1, idx));
      const el = document.getElementById(sceneOrder[clamped]);
      if (!el) return;
      autoScrolling.current = true;
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      setSceneIdx(clamped);
      window.setTimeout(() => {
        autoScrolling.current = false;
      }, 700);
    },
    [reducedMotion],
  );

  const next = useCallback(() => go(sceneIdx + 1), [go, sceneIdx]);
  const prev = useCallback(() => go(sceneIdx - 1), [go, sceneIdx]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, []);

  // клавиатура в режиме ведущего
  useEffect(() => {
    if (!presenting) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      switch (e.key) {
        case " ":
        case "PageDown":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case "PageUp":
        case "ArrowUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(sceneOrder.length - 1);
          break;
        case "f":
        case "F":
        case "а":
        case "А":
          toggleFullscreen();
          break;
        case "n":
        case "N":
        case "т":
        case "Т":
          setNotesOpen((v) => !v);
          break;
        case "s":
        case "S":
        case "ы":
        case "Ы":
          setSnap((v) => !v);
          break;
        case "Escape":
          setNotesOpen(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting, next, prev, go, toggleFullscreen]);

  // мягкий snap к началу сцены после остановки прокрутки
  useEffect(() => {
    if (!presenting || !snap) return;
    const onScroll = () => {
      if (autoScrolling.current) return;
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        const tops = sceneTops();
        const y = window.scrollY;
        let best: { top: number } | null = null;
        tops.forEach((t) => {
          if (Math.abs(t.top - y) < window.innerHeight * 0.22) best = { top: t.top };
        });
        if (best && Math.abs((best as { top: number }).top - y) > 8) {
          autoScrolling.current = true;
          window.scrollTo({ top: (best as { top: number }).top, behavior: reducedMotion ? "auto" : "smooth" });
          window.setTimeout(() => {
            autoScrolling.current = false;
          }, 600);
        }
      }, 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [presenting, snap, reducedMotion]);

  const enter = useCallback(() => {
    setPresenting(true);
    track("mc_presenter_open");
    const url = new URL(window.location.href);
    url.searchParams.set("presenter", "1");
    history.replaceState(null, "", url.toString());
  }, []);

  const exit = useCallback(() => {
    setPresenting(false);
    setNotesOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("presenter");
    history.replaceState(null, "", url.toString());
  }, []);

  return {
    presenting,
    notesOpen,
    snap,
    sceneIdx,
    sceneId: sceneOrder[sceneIdx],
    enter,
    exit,
    toggleNotes: () => setNotesOpen((v) => !v),
    toggleSnap: () => setSnap((v) => !v),
    toggleFullscreen,
    go,
    next,
    prev,
  };
}
