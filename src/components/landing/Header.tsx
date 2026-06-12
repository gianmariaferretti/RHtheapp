"use client";

import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { BoltIcon } from "@/components/ui/icons";

export function Header() {
  return (
    <header className="glass-nav sticky top-0 z-20 -mt-px border-x-0">
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Logo />
        <ButtonLink href="/activate" size="md" className="shrink-0 px-4 py-2 text-[13px]">
          <BoltIcon className="h-4 w-4" />
          Connect Free
        </ButtonLink>
      </div>
    </header>
  );
}
