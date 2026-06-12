"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BoltIcon, ChartIcon } from "@/components/ui/icons";

/**
 * Wraps the whole app in an iPhone-style device frame so it always renders at
 * phone dimensions (even on desktop), with an iOS status bar, Dynamic Island,
 * and a Liquid-Glass bottom tab bar. The colourful ambient blobs sit behind the
 * frosted-glass content to give the glass real depth.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const showTabs = pathname !== "/activate"; // focused onboarding hides the tabs

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#06120d] sm:p-6">
      {/* desk ambience (only visible around the phone on larger screens) */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/30 blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-ocean-600/30 blur-[100px]" />
      </div>

      {/* Phone */}
      <div className="phone relative h-[100dvh] w-full overflow-hidden bg-black sm:h-[min(860px,100dvh_-_3rem)] sm:w-[404px] sm:rounded-[3.6rem] sm:border-[11px] sm:border-black sm:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.06)]">
        {/* Screen — `transform-gpu` makes it the containing block so any
            `position: fixed` modal inside stays within the phone, not the desk. */}
        <div className="relative h-full w-full transform-gpu overflow-hidden bg-[#eaf5ef]">
          <ScreenBackdrop />
          <DynamicIsland />
          <StatusBar />

          {/* Scrollable content area (starts below the status bar) */}
          <div
            className={`no-scrollbar absolute inset-x-0 top-[54px] bottom-0 overflow-y-auto overflow-x-hidden ${
              showTabs ? "pb-28" : "pb-6"
            }`}
          >
            {children}
          </div>

          {showTabs && <TabBar pathname={pathname} />}
        </div>
      </div>
    </div>
  );
}

function ScreenBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#eef7f1] via-[#e8f4ef] to-[#e4f1f4]" />
      <div className="animate-blob absolute -left-16 top-24 h-64 w-64 rounded-full bg-forest-300/55 blur-3xl" />
      <div
        className="animate-blob absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-ocean-300/50 blur-3xl"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="animate-blob absolute bottom-24 left-1/4 h-64 w-64 rounded-full bg-accent-light/45 blur-3xl"
        style={{ animationDelay: "-9s" }}
      />
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="absolute left-1/2 top-2 z-40 h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#10231b]" />
    </div>
  );
}

function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-30 flex h-[54px] items-center justify-between px-7 pt-2 text-forest-950">
      <span className="text-sm font-bold tabular-nums" suppressHydrationWarning>
        {time || "9:41"}
      </span>
      <span className="flex items-center gap-1.5">
        {/* signal */}
        <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M1 4.2C3 2.5 5.4 1.5 8 1.5s5 1 7 2.7" strokeLinecap="round" />
          <path d="M3.4 6.6C4.7 5.6 6.3 5 8 5s3.3.6 4.6 1.6" strokeLinecap="round" />
          <circle cx="8" cy="9.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
        {/* battery */}
        <span className="ml-0.5 flex items-center">
          <span className="relative h-3 w-6 rounded-[4px] border border-forest-950/40 p-[2px]">
            <span className="block h-full w-[78%] rounded-[2px] bg-forest-950" />
          </span>
          <span className="ml-[1px] h-1.5 w-[2px] rounded-r bg-forest-950/40" />
        </span>
      </span>
    </div>
  );
}

const TABS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/activate", label: "Connect", icon: BoltIcon },
  { href: "/dashboard", label: "Dashboard", icon: ChartIcon },
];

function TabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 px-4 pb-5 pt-1">
      <div className="glass-nav flex items-center justify-around rounded-[1.75rem] px-2 py-2.5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors ${
                active ? "text-forest-700" : "text-forest-900/45"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  active ? "bg-gradient-to-br from-forest-500 to-ocean-500 text-white shadow-soft" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
