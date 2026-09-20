"use client";

import { motion } from "framer-motion";

interface Line {
  text: string;
  className?: string;
}

/** Заголовок, строки которого выезжают из-под «маски». */
export function MaskLines({
  lines,
  className,
}: {
  lines: Line[];
  className?: string;
}) {
  return (
    <h2 className={className}>
      {lines.map((l, i) => (
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            className={`block ${l.className ?? ""}`}
          >
            {l.text}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
