import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export interface AISummaryResult {
  title: string;
  descriptionShort: string;
  highlights: string[];
  ingredients: string[];
  steps: string[];
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: string | null;
}

export async function summarizeRecipeUrl(
  extractedText: string
): Promise<AISummaryResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a recipe data extractor. Given the following text extracted from a recipe webpage, produce a JSON object with these fields:

- "title": The recipe title/name.
- "descriptionShort": A 1-2 sentence summary of the recipe.
- "highlights": An array of 3-5 bullet-point strings covering time/effort, key techniques, and standout flavors.
- "ingredients": An array of ingredient strings (include quantities if available).
- "steps": An array of step strings in order. Each step should be a single clear instruction.
- "prepTimeMinutes": Prep time in minutes as a number, or null if not found. Convert all times to minutes (e.g., 1 hour = 60).
- "cookTimeMinutes": Cook time in minutes as a number, or null if not found. Convert all times to minutes.
- "servings": Servings as a string (e.g. "4", "6-8"), or null if not found.

Respond ONLY with valid JSON, no other text.

Recipe text:
${extractedText}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as AISummaryResult;
}
