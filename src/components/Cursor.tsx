"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** Кастомный курсор с инверсией цвета. Только для мыши. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 });
  const [big, setBig] = useState(false);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setBig(!!t?.closest("a, button, [data-cursor]"));
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference pointer-coarse:hidden"
    >
      <motion.div
        animate={{ scale: big ? 2.6 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="-ml-2 -mt-2 size-4 rounded-full bg-white"
      />
    </motion.div>
  );
}
