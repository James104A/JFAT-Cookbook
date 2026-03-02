import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/recipes/:id/cook — Increment cook count ("Cooked it!" button)
export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      cookCount: { increment: 1 },
      lastCookedAt: new Date(),
    },
  });

  return NextResponse.json(recipe);
}
