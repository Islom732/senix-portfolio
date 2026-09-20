"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useTheme } from "./ThemeProvider";

interface ParticleTextProps {
  text: string;
  /** Элемент с текстом: с него берутся шрифт, размер и положение. */
  sourceRef: RefObject<HTMLElement | null>;
  /** Запас вокруг текста, куда частицы могут «разлетаться». */
  pad?: number;
  /** Через сколько секунд после загрузки начать сборку. */
  startDelay?: number;
  onReady?: () => void;
}

const RADIUS = 130;
const FORCE = 16;
const SPRING = 0.035;
const DAMP = 0.87;

/** Текст из тысяч частиц: слетаются в слова, отталкиваются от курсора. */
export function ParticleText({
  text,
  sourceRef,
  pad = 110,
  startDelay = 1.3,
  onReady,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Задержка нужна только при первой сборке; при смене текста (языка) собираем сразу. */
  const firstBuild = useRef(true);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const src = sourceRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !src || !ctx) return;

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() ||
      "#000";

    let cancelled = false;
    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let size = 2;
    let gap = 3;
    let count = 0;
    let crisp: HTMLCanvasElement | null = null;
    let moved = new Int32Array(0);
    // x, y, vx, vy, tx, ty на частицу
    let p = new Float32Array(0);
    let delay = new Float32Array(0);
    let t0 = performance.now() + (firstBuild.current ? startDelay : 0.05) * 1000;
    const mouse = { x: -9999, y: -9999 };
    let scaleX = 1;
    let scaleY = 1;

    function build(assemble: boolean) {
      if (!canvas || !src || !ctx) return;
      const cs = getComputedStyle(src);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.ceil(src.offsetWidth + pad * 2);
      H = Math.ceil(src.offsetHeight + pad * 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      o.letterSpacing =
        cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#000"; // маска для сбора точек — цвет не важен
      o.fillText(text, W / 2, H / 2);
      const data = o.getImageData(0, 0, W, H).data;

      // Чёткий текст «в покое»: рисуем с учётом плотности пикселей
      const c = document.createElement("canvas");
      c.width = W * dpr;
      c.height = H * dpr;
      const cc = c.getContext("2d");
      if (!cc) return;
      cc.scale(dpr, dpr);
      cc.font = o.font;
      cc.letterSpacing = o.letterSpacing;
      cc.textAlign = "center";
      cc.textBaseline = "middle";
      cc.fillStyle = ink;
      cc.fillText(text, W / 2, H / 2);
      crisp = c;

      const fontPx = parseFloat(cs.fontSize) || 100;
      gap = Math.max(3, Math.round(fontPx / 68));
      size = gap * 0.78;

      const alphaAt = (x: number, y: number) =>
        data[(Math.min(H - 1, y) * W + Math.min(W - 1, x)) * 4 + 3];
      const targets: number[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const e = gap - 1;
          const h = gap >> 1;
          if (
            alphaAt(x, y) > 100 ||
            alphaAt(x + e, y) > 100 ||
            alphaAt(x, y + e) > 100 ||
            alphaAt(x + e, y + e) > 100 ||
            alphaAt(x + h, y + h) > 100
          ) {
            targets.push(x, y);
          }
        }
      }

      count = targets.length / 2;
      moved = new Int32Array(count);
      p = new Float32Array(count * 6);
      delay = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const tx = targets[i * 2];
        const ty = targets[i * 2 + 1];
        const o6 = i * 6;
        if (assemble) {
          p[o6] = W / 2 + (Math.random() - 0.5) * W * 1.5;
          p[o6 + 1] = H / 2 + (Math.random() - 0.5) * H * 2.6;
          delay[i] = (tx / W) * 0.7 + Math.random() * 0.35;
        } else {
          p[o6] = tx;
          p[o6 + 1] = ty;
        }
        p[o6 + 4] = tx;
        p[o6 + 5] = ty;
      }
      if (!assemble) t0 = 0;
    }

    function frame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const t = (now - t0) / 1000;
      if (t >= 0 && crisp) {
        // 1) чёткий текст, 2) вырезаем клетки улетевших частиц, 3) рисуем их
        ctx.drawImage(crisp, 0, 0, W, H);
        const mx = mouse.x;
        const my = mouse.y;
        let n = 0;
        for (let i = 0; i < count; i++) {
          const o6 = i * 6;
          let x = p[o6];
          let y = p[o6 + 1];
          if (t >= delay[i]) {
            let vx = p[o6 + 2];
            let vy = p[o6 + 3];
            const dx = x - mx;
            const dy = y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < RADIUS * RADIUS) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / RADIUS) ** 2 * FORCE;
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
            vx += (p[o6 + 4] - x) * SPRING;
            vy += (p[o6 + 5] - y) * SPRING;
            vx *= DAMP;
            vy *= DAMP;
            x += vx;
            y += vy;
            p[o6] = x;
            p[o6 + 1] = y;
            p[o6 + 2] = vx;
            p[o6 + 3] = vy;
          }
          const ex = x - p[o6 + 4];
          const ey = y - p[o6 + 5];
          if (ex * ex + ey * ey > 1) {
            moved[n++] = i;
            ctx.clearRect(p[o6 + 4] - 0.5, p[o6 + 5] - 0.5, gap + 1, gap + 1);
          }
        }
        ctx.fillStyle = ink;
        for (let k = 0; k < n; k++) {
          const o6 = moved[k] * 6;
          ctx.fillRect(p[o6] - size / 2, p[o6 + 1] - size / 2, size, size);
        }
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    }

    function onMove(e: PointerEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      scaleX = r.width ? W / r.width : 1;
      scaleY = r.height ? H / r.height : 1;
      mouse.x = (e.clientX - r.left) * scaleX;
      mouse.y = (e.clientY - r.top) * scaleY;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => build(false), 200);
    }

    document.fonts.ready.then(() => {
      if (cancelled) return;
      build(true);
      firstBuild.current = false;
      onReady?.();
      raf = requestAnimationFrame(frame);
    });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && count) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, pad, startDelay, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: -pad,
        top: -pad,
        width: `calc(100% + ${pad * 2}px)`,
        height: `calc(100% + ${pad * 2}px)`,
      }}
    />
  );
}
