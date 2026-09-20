"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Плавная «масляная» прокрутка. Отключается при «уменьшить движение». */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, []);
  return null;
}
