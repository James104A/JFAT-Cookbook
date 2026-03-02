import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export interface RecipeStructuredData {
  title: string | null;
  descriptionShort: string | null;
  ingredients: string[] | null;
  steps: string[] | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: string | null;
  imageUrl: string | null;
}

export interface ExtractResult {
  text: string;
  imageUrl: string | null;
  structured: RecipeStructuredData | null;
}

/** Parse ISO 8601 duration (PT30M, PT1H15M, etc.) to minutes */
function parseDuration(duration: string | undefined | null): number | null {
  if (!duration || typeof duration !== "string") return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const total = hours * 60 + minutes;
  return total > 0 ? total : null;
}

/** Extract step text from Schema.org HowToStep / HowToSection */
function parseSteps(steps: unknown): string[] | null {
  if (!steps) return null;
  const arr = Array.isArray(steps) ? steps : [steps];
  const result: string[] = [];

  for (const item of arr) {
    if (typeof item === "string") {
      result.push(item);
    } else if (item?.text) {
      result.push(item.text);
    } else if (item?.itemListElement) {
      const nested = parseSteps(item.itemListElement);
      if (nested) result.push(...nested);
    }
  }

  return result.length > 0 ? result : null;
}

/** Extract structured Recipe data from JSON-LD */
function extractStructuredRecipe(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  baseUrl: string
): RecipeStructuredData | null {
  const ldScripts = doc.querySelectorAll('script[type="application/ld+json"]');

  for (const script of ldScripts) {
    try {
      const data = JSON.parse(script.textContent || "");
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        // Handle @graph arrays (common in WordPress)
        const candidates = item["@graph"]
          ? [...items, ...item["@graph"]]
          : items;

        for (const candidate of candidates) {
          const type = candidate["@type"];
          const isRecipe =
            type === "Recipe" ||
            (Array.isArray(type) && type.includes("Recipe"));
          if (!isRecipe) continue;

          // Image
          let imageUrl: string | null = null;
          const img = candidate.image;
          if (typeof img === "string" && img.startsWith("http")) {
            imageUrl = img;
          } else if (
            Array.isArray(img) &&
            typeof img[0] === "string" &&
            img[0].startsWith("http")
          ) {
            imageUrl = img[0];
          } else if (img?.url) {
            imageUrl = img.url;
          }

          // Ingredients
          const rawIngredients = candidate.recipeIngredient;
          const ingredients =
            Array.isArray(rawIngredients) && rawIngredients.length > 0
              ? rawIngredients.map(String)
              : null;

          // Servings
          const yld = candidate.recipeYield;
          const servings = yld
            ? String(Array.isArray(yld) ? yld[0] : yld)
            : null;

          return {
            title: candidate.name || null,
            descriptionShort: candidate.description || null,
            ingredients,
            steps: parseSteps(candidate.recipeInstructions),
            prepTimeMinutes: parseDuration(candidate.prepTime),
            cookTimeMinutes: parseDuration(candidate.cookTime),
            servings,
            imageUrl,
          };
        }
      }
    } catch {
      // invalid JSON, continue
    }
  }

  return null;
}

function extractImageUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any,
  baseUrl: string
): string | null {
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

  // 2. First reasonably-sized <img> in the body
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any;

  // Try structured Recipe data first
  const structured = extractStructuredRecipe(doc, url);

  // Extract image (structured data image takes priority)
  const imageUrl = structured?.imageUrl || extractImageUrl(doc, url);

  // Extract readable text (for AI fallback)
  const reader = new Readability(doc);
  const article = reader.parse();
  const text = article?.textContent?.trim().slice(0, 8000) || "";

  return {
    text,
    imageUrl,
    structured,
  };
}
