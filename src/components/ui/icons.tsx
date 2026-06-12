import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const BoltIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20c0-9 6-15 16-15 0 10-6 16-15 16" />
    <path d="M4 20c4-6 8-8 12-9" />
  </svg>
);

export const TreeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 22v-6" />
    <path d="M12 16c-3.5 0-6-2.2-6-5.2C6 8 7.5 7 7.5 7S7 4 12 2c5 2 4.5 5 4.5 5S18 8 18 10.8c0 3-2.5 5.2-6 5.2z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const SparklesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    <path d="M9 9 7.5 7.5M16.5 16.5 15 15M15 9l1.5-1.5M7.5 16.5 9 15" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const ThermostatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
  </svg>
);

export const DollarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v20" />
    <path d="M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.8 7 6.7c0 4.6 10 2.3 10 7 0 2-2.2 3.3-5 3.3s-5-1.2-5-3.2" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 5v14l11-7z" fill="currentColor" stroke="none" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 5v14M15 5v14" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9h12v-9" />
  </svg>
);

export const TrophyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 14.5V18M14 14.5V18M8 21h8" />
  </svg>
);

export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
  </svg>
);

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
  </svg>
);
