import { NextRequest, NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/extract";
import { summarizeRecipeUrl } from "@/lib/ai";
import { isAuthenticated } from "@/lib/auth";

// POST /api/recipes/summarize — Fetch URL and generate AI summary
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { text, imageUrl } = await extractFromUrl(url);
    const summary = await summarizeRecipeUrl(text);

    return NextResponse.json({
      ...summary,
      imageUrl,
      sourceUrl: url,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to summarize URL";
    return NextResponse.json(
      { error: message, fallback: true },
      { status: 422 }
    );
  }
}
