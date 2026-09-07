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

  // 1. Remove markdown tables (e.g., | Event Date | Event Description | ...)
  let text = raw.replace(/^\|.*\|$/gm, " ");

  // 2. Remove markdown images: ![alt](url)
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");

  // 3. Remove markdown links: [Text](URL) -> Text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 4. Remove raw URLs: http://... or https://...
  text = text.replace(/https?:\/\/\S+/gi, "");

  // 5. Remove HTML tags & entities
  text = text.replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " ");

  // 6. Remove common e-commerce, USPTO navigation, and government header boilerplate lines
  const boilerplateRegex =
    /(?:enable accessibility|unlock \d+% off|set my zip|select your profession|by submitting this form|all rights reserved|terms of use|privacy policy|cookie policy|skip to main content|the \.gov means it’s official|an official website of the united states government|item added to cart|receive updates from the uspto|close up of watertight seal|sign in to your account|tell us what you think|get my offer|show all help text|notifications|announcements|recent drafts|view drafts and docket|order trademark presentation copy|release notes|view key changes|open menu close menu|search this guide|clear search|table of contents|quick links|add electrek as a preferred source|ftc: we use income earning|contact us today|schedule confidential consultation|top comment by|liked by \d+ people|view all comments|free webinars for all|ask a lawyer get free answers|have a legal question|lawyers - get listed now|get a free directory profile|download adobe reader|trademark status & document retrieval|tsdr help|edit announcement|for assistance with tsdr)/gi;
  text = text.replace(boilerplateRegex, " ");

  // 7. Clean up markdown lists, bullets, headings, and breadcrumb symbols (+, -, *, #, >, ›, etc.)
  text = text.replace(/^[\s*•\-#|>+›]+\s*/gm, "");

  // 8. Filter out fragmented navigational lines, short menus, and table remnants
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (line.length < 20) return false;
      if (/^(home|specs|reviews|overview|back to search|print|download|subscribe|close|expand|share|menu|more|next|previous)$/i.test(line)) return false;
      if (/^[|:\-\s]+$/.test(line)) return false; // table separator lines
      if (/^(serial number|status date|filing date|primary code|us class codes|international class|mark drawing|party name|attorney name)/i.test(line)) return false;
      return true;
    })
    .join(" ");

  // 9. Clean duplicate whitespace and collapse
  text = text.replace(/\s{2,}/g, " ").trim();

  // Fallback: If stripping left us with nothing, provide a clean sanitized excerpt from raw
  if (!text) {
    text = raw.replace(/[|#*`_\[\]()]/g, " ").replace(/\s{2,}/g, " ").trim();
  }

  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trim() + "...";
}
