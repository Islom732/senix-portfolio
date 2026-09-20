import Link from "next/link";

/** Своя 404 в стиле терминала (двуязычная: язык здесь заранее неизвестен). */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <div className="always-dark w-full max-w-xl rounded-2xl border border-line bg-black p-6 text-left font-mono text-sm leading-relaxed text-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] sm:p-8">
        <div className="mb-5 flex gap-2">
          <span className="size-3 rounded-full bg-rose-500" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-emerald-500" />
        </div>
        <p>
          <span className="text-emerald-400">guest@senix:~$</span> cd /this-page
        </p>
        <p className="mt-2 text-rose-400">bash: cd: /this-page: No such file or directory</p>
        <p className="mt-2 text-white/50">404 — страница не найдена · sahifa topilmadi</p>
        <p className="mt-5">
          <span className="text-emerald-400">guest@senix:~$</span> cd ~
          <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-emerald-400" />
        </p>
      </div>
      <Link
        href="/"
        className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
      >
        ← Home · Главная · Bosh sahifa
      </Link>
    </main>
  );
}