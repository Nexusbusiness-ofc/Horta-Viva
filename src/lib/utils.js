import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

export function resolveAssetUrl(url) {
  if (!url) return url;
  if (/^(https?:|\/\/|data:)/i.test(url)) return url;

  const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
  const prefix = base.endsWith("/") ? base : base + "/";
  const cleanBase = prefix.replace(/^\/+|\/+$/g, "");

  let cleaned = String(url).trim();
  while (cleaned.startsWith("./")) cleaned = cleaned.slice(2);
  while (cleaned.startsWith("/")) cleaned = cleaned.slice(1);

  if (cleanBase && cleaned.startsWith(cleanBase + "/")) {
    cleaned = cleaned.slice(cleanBase.length + 1);
  }

  return prefix + cleaned;
}
