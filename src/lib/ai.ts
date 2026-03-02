import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export interface AISummaryResult {
  descriptionShort: string;
  highlights: string[];
  ingredients: string[];
}

export async function summarizeRecipeUrl(
  extractedText: string
): Promise<AISummaryResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a recipe summarizer. Given the following text extracted from a recipe webpage, produce a JSON object with these fields:

- "descriptionShort": A 1–2 sentence summary of the recipe.
- "highlights": An array of 3–5 bullet-point strings covering time/effort, key techniques, and standout flavors.
- "ingredients": An array of ingredient strings (best effort, include quantities if available).

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
