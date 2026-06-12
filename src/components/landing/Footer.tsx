import { LogoMark } from "@/components/ui/Logo";

const LINKS = ["How it works", "Savings", "Compatible devices", "Privacy", "Terms", "Help"];

export function Footer() {
  return (
    <footer className="container-page pb-8 pt-6">
      <div className="card p-6 text-center">
        <div className="flex items-center justify-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-forest-900">
            Renew<span className="text-forest-600">Home</span>
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-forest-800/70">
          Cheaper times. Cleaner times. No effort. Connecting your home to a cleaner grid — while
          you stay in full control.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {LINKS.map((link) => (
            <span key={link} className="cursor-default text-[12px] font-medium text-forest-700/70">
              {link}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-forest-900/10 pt-4 text-[11px] text-forest-700/60">
          <p>© {new Date().getFullYear()} Renew Home</p>
          <p className="mt-1 font-medium">
            Simulated prototype — every number, device, and reward is fictional.
          </p>
        </div>
      </div>
    </footer>
  );
}
