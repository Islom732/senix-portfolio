"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { avatar } from "@/content/site";
import { useI18n } from "./I18nProvider";

export function Avatar() {
  const { t } = useI18n();
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto size-32 sm:size-36"
    >
      {/* Пульсирующее кольцо */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border border-black/20"
        animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Орбита с точкой */}
      <motion.div
        aria-hidden
        className="absolute -inset-5 rounded-full border border-dashed border-line"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-black" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute -inset-10 rounded-full border border-line/70"
        animate={{ rotate: -360 }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-muted" />
      </motion.div>

      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full border border-line bg-gradient-to-b from-white to-line shadow-[0_18px_50px_-14px_rgba(0,0,0,0.35)]">
        {avatar ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${avatar}`}
            alt={t.name}
            fill
            sizes="144px"
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-6xl font-semibold tracking-tight">
            {t.initial}
          </span>
        )}
      </div>
    </motion.div>
  );
}
