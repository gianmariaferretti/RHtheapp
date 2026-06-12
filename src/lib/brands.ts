import type { Brand } from "./types";

// Compatibility brands. Logos are rendered as styled wordmarks (no external assets).
export const BRANDS: Brand[] = [
  {
    id: "nest",
    name: "Nest / Google",
    blurb: "Learning thermostats",
    accent: "from-ocean-400 to-forest-400",
  },
  {
    id: "ecobee",
    name: "Ecobee",
    blurb: "SmartThermostat",
    accent: "from-amber-400 to-orange-400",
  },
  {
    id: "honeywell",
    name: "Honeywell",
    blurb: "Home T-series",
    accent: "from-red-400 to-rose-400",
  },
  {
    id: "lg",
    name: "LG ThinQ",
    blurb: "Connected climate",
    accent: "from-pink-400 to-rose-400",
  },
  {
    id: "rheem",
    name: "Rheem",
    blurb: "EcoNet heating",
    accent: "from-sky-400 to-ocean-500",
  },
  {
    id: "amazon",
    name: "Amazon",
    blurb: "Smart Thermostat",
    accent: "from-yellow-400 to-amber-500",
  },
];

export function getBrand(id: string | null): Brand | undefined {
  if (!id) return undefined;
  return BRANDS.find((b) => b.id === id);
}
