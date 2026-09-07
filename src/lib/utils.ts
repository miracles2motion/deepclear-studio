import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Sanitizes and extracts the readable core of raw Parallel Search snippets,
 * stripping markdown links, cookie notices, site navigation headers, and boilerplate.
 */
export function cleanParallelSnippet(raw: string, maxChars: number = 320): string {
  if (!raw || typeof raw !== "string") return "";

  // 1. Remove markdown links: [Text](URL) -> Text
  let text = raw.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 2. Remove raw URLs: http://... or https://...
  text = text.replace(/https?:\/\/\S+/gi, "");

  // 3. Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 4. Remove common e-commerce / government header boilerplate lines
  const boilerplateRegex =
    /(?:enable accessibility|unlock \d+% off|set my zip|select your profession|by submitting this form|all rights reserved|terms of use|privacy policy|cookie policy|skip to main content|the \.gov means it’s official|an official website of the united states government|item added to cart|receive updates from the uspto|close up of watertight seal|sign in to your account|tell us what you think|get my offer)/gi;
  text = text.replace(boilerplateRegex, "");

  // 5. Clean up markdown lists and bullet characters
  text = text.replace(/^[\s*•\-#|]+\s*/gm, "");

  // 6. Clean duplicate whitespace and newlines
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 15 && !/^(home|specs|reviews|overview|back to search|print|download)$/i.test(line))
    .join(" ");

  text = text.replace(/\s{2,}/g, " ").trim();

  if (text.length <= maxChars) return text || raw.slice(0, maxChars);
  return text.slice(0, maxChars).trim() + "...";
}
