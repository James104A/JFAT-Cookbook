import { NextRequest, NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/extract";
import { summarizeRecipeUrl } from "@/lib/ai";
import { isAuthenticated } from "@/lib/auth";

// POST /api/recipes/summarize — Extract recipe data from URL
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { text, imageUrl, structured } = await extractFromUrl(url);

    // If we got structured Recipe data from JSON-LD, use it directly (free & fast)
    if (structured && structured.title && structured.ingredients) {
      return NextResponse.json({
        title: structured.title,
        descriptionShort: structured.descriptionShort,
        highlights: [],
        ingredients: structured.ingredients,
        steps: structured.steps || [],
        prepTimeMinutes: structured.prepTimeMinutes,
        cookTimeMinutes: structured.cookTimeMinutes,
        servings: structured.servings,
        imageUrl,
        sourceUrl: url,
        fetchedAt: new Date().toISOString(),
        method: "structured",
      });
    }

    // Fallback: use Gemini AI to extract from page text
    if (!text) {
      throw new Error("Could not extract any content from the URL");
    }

    const summary = await summarizeRecipeUrl(text);

    return NextResponse.json({
      ...summary,
      imageUrl,
      sourceUrl: url,
      fetchedAt: new Date().toISOString(),
      method: "ai",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract recipe data";
    return NextResponse.json(
      { error: message, fallback: true },
      { status: 422 }
    );
  }
}
