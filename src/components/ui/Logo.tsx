import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-ocean-500 shadow-soft ${className}`}
      aria-hidden="true"
    >
      {/* Leaf + bolt combined glyph */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
        <path
          d="M5 13c0-4.5 4-8 11-8 0 7-3.5 11-8 11-2 0-3-1-3-3z"
          fill="currentColor"
          opacity="0.95"
        />
        <path d="M13 7l-3 5h2.2L10 17l5-6h-2.4L14 7z" fill="#16351f" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <LogoMark className="transition-transform group-hover:scale-105" />
      <span className="text-lg font-bold tracking-tight text-forest-900">
        Renew<span className="text-forest-600">Home</span>
      </span>
    </Link>
  );
}
