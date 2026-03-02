import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export interface ExtractResult {
  text: string;
  imageUrl: string | null;
}

function extractImageUrl(document: Document, baseUrl: string): string | null {
  // 1. og:image meta tag
  const ogImage = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content");
  if (ogImage) {
    try {
      return new URL(ogImage, baseUrl).href;
    } catch {
      // invalid URL, continue
    }
  }

  // 2. JSON-LD structured data
  const ldScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  for (const script of ldScripts) {
    try {
      const data = JSON.parse(script.textContent || "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const img = item.image;
        if (typeof img === "string" && img.startsWith("http")) return img;
        if (Array.isArray(img) && typeof img[0] === "string" && img[0].startsWith("http"))
          return img[0];
        if (img?.url && typeof img.url === "string") return img.url;
      }
    } catch {
      // invalid JSON, continue
    }
  }

  // 3. First reasonably-sized <img> in the body
  const imgs = document.querySelectorAll("img[src]");
  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (!src) continue;
    const width = parseInt(img.getAttribute("width") || "0", 10);
    if (width > 0 && width < 200) continue;
    try {
      return new URL(src, baseUrl).href;
    } catch {
      continue;
    }
  }

  return null;
}

export async function extractFromUrl(url: string): Promise<ExtractResult> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; GoToRecipes/1.0; +https://go-to-recipes.app)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const { document } = parseHTML(html);

  // Extract image before Readability mutates the DOM
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any;
  const imageUrl = extractImageUrl(doc, url);

  const reader = new Readability(doc);
  const article = reader.parse();

  if (!article?.textContent) {
    throw new Error("Could not extract readable content from the URL");
  }

  return {
    text: article.textContent.trim().slice(0, 8000),
    imageUrl,
  };
}

// Keep old export name for backwards compatibility
export async function extractTextFromUrl(url: string): Promise<string> {
  const result = await extractFromUrl(url);
  return result.text;
}
