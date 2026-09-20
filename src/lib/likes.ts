"use client";

import { useCallback, useEffect, useState } from "react";
import { API, NAMESPACE, isLocal } from "./visitors";

/*
  Лайки проектов на том же публичном API, что и счётчик посетителей.
  Отметка «уже лайкнул» хранится в localStorage; у API нет «отмены»,
  поэтому лайк ставится один раз. На localhost лайк только локальный.
*/
const flagKey = (slug: string) => `liked:${slug}`;

async function fetchCount(slug: string): Promise<number> {
  try {
    const res = await fetch(`${API}/get/${NAMESPACE}/like-${slug}`, { cache: "no-store" });
    if (!res.ok) return 0; // ключ создаётся первым лайком
    const data = (await res.json()) as { value?: number };
    return typeof data.value === "number" ? data.value : 0;
  } catch {
    return 0;
  }
}

async function sendLike(slug: string): Promise<void> {
  if (isLocal()) return;
  try {
    await fetch(`${API}/hit/${NAMESPACE}/like-${slug}`, { cache: "no-store" });
  } catch {}
}

export function useLike(slug: string) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let alive = true;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(localStorage.getItem(flagKey(slug)) === "1");
    } catch {}
    fetchCount(slug).then((n) => alive && setCount(n));
    return () => {
      alive = false;
    };
  }, [slug]);

  const like = useCallback(() => {
    if (liked) return;
    setLiked(true);
    setCount((c) => (c ?? 0) + 1);
    try {
      localStorage.setItem(flagKey(slug), "1");
    } catch {}
    void sendLike(slug);
  }, [liked, slug]);

  return { count, liked, like };
}