import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/recipes/:id/cook — Increment cook count ("Cooked it!" button)
export async function POST(_request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
