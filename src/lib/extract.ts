import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export async function extractTextFromUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; GoToRecipes/1.0; +https://go-to-recipes.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const { document } = parseHTML(html);

  const reader = new Readability(document);
  const article = reader.parse();

  if (!article?.textContent) {
    throw new Error("Could not extract readable content from the URL");
  }

  return article.textContent.trim();
}
