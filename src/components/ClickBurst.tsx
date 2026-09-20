"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

/** Искры от каждого клика по странице. Отключается при «уменьшить движение». */
export function ClickBurst() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sparks: Spark[] = [];
    let raf = 0;
    let dpr = 1;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ink =
        getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#000";
      ctx.fillStyle = ink;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vy += 0.16;
        s.vx *= 0.97;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.026;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = sparks.length ? requestAnimationFrame(frame) : 0;
    }

    function onDown(e: PointerEvent) {
      const n = 14;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
        const v = 2.2 + Math.random() * 3.6;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 1,
          life: 1,
          size: 1.6 + Math.random() * 2.2,
        });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] size-full"
    />
  );
}
