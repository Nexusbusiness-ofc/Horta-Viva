import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

export function resolveAssetUrl(url) {
  if (!url) return url;
  if (/^(https?:|\/\/|data:)/i.test(url)) return url;
  let cleaned = url;
  if (cleaned.startsWith("./")) cleaned = cleaned.slice(2);
  if (cleaned.startsWith("/")) cleaned = cleaned.slice(1);
  return "./" + cleaned;
}
