import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/recipes/:id — Get a single recipe
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

// PATCH /api/recipes/:id — Update a recipe
export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const recipe = await prisma.recipe.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(recipe);
}

// DELETE /api/recipes/:id — Delete a recipe
export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
