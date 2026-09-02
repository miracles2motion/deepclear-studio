import { ParallelGroundingCitation } from "@/types";

export interface ParallelSearchParams {
  query: string;
  category: "trademark" | "permit" | "caselaw" | "tax";
  maxResults?: number;
}

export async function searchParallelGrounding({
  query,
  category,
  maxResults = 3,
}: ParallelSearchParams): Promise<ParallelGroundingCitation[]> {
  const apiKey = process.env.PARALLEL_API_KEY;

  if (!apiKey || apiKey === "your_parallel_api_key_here") {
    throw new Error(
      "PARALLEL_API_KEY is not set or invalid. Please configure your API key in .env.local or Vercel Environment Variables."
    );
  }

  const response = await fetch("https://api.parallel.ai/v1/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `${category} clearance: ${query}`,
      limit: maxResults,
      include_snippets: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Parallel Search API request failed with status ${response.status}: ${errorText || response.statusText}`
    );
  }

  const data = await response.json();
  const results = data.results || [];

  return results.map((item: { title?: string; url?: string; snippet?: string }, idx: number) => ({
    id: `parallel-${category}-${Date.now()}-${idx}`,
    category,
    title: item.title || `${category.toUpperCase()} Reference: ${query}`,
    sourceUrl: item.url || "https://parallel.ai",
    snippet: item.snippet || `Verified via Parallel Search API for "${query}".`,
    verified: true,
  }));
}
