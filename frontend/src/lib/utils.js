import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import NepaliDate from "@zener/nepali-date";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-US", { hour12: false });
}

export function formatDate(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    const nd = new NepaliDate(d);
    return nd.format("YYYY/MM/DD", "np");
  } catch (err) {
    return new Date(isoString).toLocaleDateString("ne-NP");
  }
}

