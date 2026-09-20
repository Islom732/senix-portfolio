"use client";

import { useEffect, useState } from "react";

/*
  Счётчик посетителей на публичном API Abacus (без ключей и регистрации).
  Один браузер засчитывается один раз (флаг в localStorage); локальная
  разработка счётчик не накручивает — только читает значение.
*/
const API = "https://abacus.jasoncameron.dev";
const NAMESPACE = "senix-portfolio-utkir";
const KEY = "visits";
const FLAG = "visited";

let pending: Promise<number | null> | null = null;

const isLocal = () =>
  /^(localhost|127\.|0\.0\.0\.0|\[::1\]|192\.168\.|10\.)/.test(location.hostname);

async function call(action: "hit" | "get"): Promise<number | null> {
  try {
    const res = await fetch(`${API}/${action}/${NAMESPACE}/${KEY}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { value?: number };
    return typeof data.value === "number" ? data.value : null;
  } catch {
    return null;
  }
}

/** Один запрос на всю страницу: и футер, и терминал получают один и тот же результат. */
export function loadVisitors(): Promise<number | null> {
  if (!pending) {
    let seen = false;
    try {
      seen = localStorage.getItem(FLAG) === "1";
    } catch {}

    const shouldCount = !seen && !isLocal();
    pending = call(shouldCount ? "hit" : "get").then(async (n) => {
      // Ключ создаётся первым визитом: если его ещё нет, читающий запрос вернёт null
      if (n === null && !shouldCount && !isLocal()) return call("hit");
      if (n !== null && shouldCount) {
        try {
          localStorage.setItem(FLAG, "1");
        } catch {}
      }
      return n;
    });
  }
  return pending;
}

/** `undefined` — грузится, `null` — недоступно, число — значение. */
export function useVisitors(): number | null | undefined {
  const [value, setValue] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    loadVisitors().then((n) => alive && setValue(n));
    return () => {
      alive = false;
    };
  }, []);
  return value;
}
