"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, type PointerEvent, type ReactNode } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
}

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium select-none";

const variants = {
  primary: "bg-black text-white",
  secondary: "border border-line bg-white text-black",
} as const;

let rippleId = 0;

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Магнит: кнопка тянется за курсором
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16 });
  const y = useSpring(my, { stiffness: 220, damping: 16 });

  function addRipple(e: PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    setRipples((prev) => [
      ...prev,
      {
        id: rippleId++,
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
        size,
      },
    ]);
  }

  function onMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.34);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerDown={addRipple}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onAnimationComplete={() =>
            setRipples((prev) => prev.filter((p) => p.id !== r.id))
          }
          className="pointer-events-none absolute rounded-full bg-current"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </motion.a>
  );
}
