"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const GAP = 30;
const RADIUS = 190;

/** Интерактивное поле точек: они «расступаются» и вспыхивают рядом с курсором. */
export function DotField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() ||
      "#000";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    function resize() {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = i * GAP;
          const by = j * GAP;
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const d = Math.hypot(dx, dy);
          const k = d < RADIUS ? (1 - d / RADIUS) ** 2 : 0;
          const wave = Math.sin(t * 0.0013 + bx * 0.011 + by * 0.011);
          const px = bx + (d > 0 ? (dx / d) * k * 24 : 0);
          const py = by + (d > 0 ? (dy / d) * k * 24 : 0);
          const r = 1.1 + wave * 0.28 + k * 3.6;
          const a = 0.13 + (wave + 1) * 0.035 + k * 0.8;
          ctx.globalAlpha = Math.min(a, 1);
          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop(t: number) {
      draw(t);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    }

    function onMove(e: PointerEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    }

    function onLeave() {
      mouse.tx = -9999;
      mouse.ty = -9999;
    }

    resize();
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [theme]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
