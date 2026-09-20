"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Уважает системную настройку «уменьшить движение». */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
