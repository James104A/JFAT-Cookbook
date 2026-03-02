import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/recipes — List all recipes with optional filtering
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(recipes);
}

// POST /api/recipes — Create a new recipe
export async function POST(request: NextRequest) {
  const body = await request.json();

  const recipe = await prisma.recipe.create({
    data: {
      title: body.title,
      recipeType: body.recipeType,
      url: body.url ?? null,
      descriptionShort: body.descriptionShort ?? null,
      highlights: body.highlights ? JSON.stringify(body.highlights) : null,
      ingredients: body.ingredients ? JSON.stringify(body.ingredients) : null,
      steps: body.steps ? JSON.stringify(body.steps) : null,
      personalNotes: body.personalNotes ?? null,
      seasonTags: body.seasonTags ? JSON.stringify(body.seasonTags) : null,
      dishTypes: body.dishTypes ? JSON.stringify(body.dishTypes) : null,
      cuisineTypes: body.cuisineTypes ? JSON.stringify(body.cuisineTypes) : null,
      goodForTags: body.goodForTags ? JSON.stringify(body.goodForTags) : null,
      dietaryTags: body.dietaryTags ? JSON.stringify(body.dietaryTags) : null,
      mainIngredientTags: body.mainIngredientTags
        ? JSON.stringify(body.mainIngredientTags)
        : null,
      prepTimeMinutes: body.prepTimeMinutes ?? null,
      cookTimeMinutes: body.cookTimeMinutes ?? null,
      totalTimeMinutes: body.totalTimeMinutes ?? null,
      servings: body.servings ?? null,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}
