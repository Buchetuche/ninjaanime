import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(base, params = {}) {
  const query = new URLSearchParams(params);
  return `${base}?${query.toString()}`;
}
