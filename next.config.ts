import type { NextConfig } from "next";

// На GitHub Pages проект живёт в подпапке /<репозиторий>; workflow передаёт её сюда.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Статический экспорт: сайт можно выложить на любой бесплатный хостинг.
  output: "export",
  images: { unoptimized: true },
  ...(basePath && { basePath }),
};

export default nextConfig;
