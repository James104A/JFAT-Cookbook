import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/recipes/:id/cook — Get cook history
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const logs = await prisma.cookLog.findMany({
    where: { recipeId: id },
    orderBy: { cookedAt: "desc" },
  });

  return NextResponse.json(logs);
}

// POST /api/recipes/:id/cook — Log a cook
export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const cookedAt = body.cookedAt ? new Date(body.cookedAt) : new Date();
  const notes = body.notes?.trim() || null;

  const [cookLog] = await prisma.$transaction([
    prisma.cookLog.create({
      data: { recipeId: id, cookedAt, notes },
    }),
    prisma.recipe.update({
      where: { id },
      data: {
        cookCount: { increment: 1 },
        lastCookedAt: cookedAt,
      },
    }),
  ]);

  return NextResponse.json(cookLog, { status: 201 });
}

// DELETE /api/recipes/:id/cook — Remove a cook log entry
export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { logId } = await request.json();

  await prisma.$transaction(async (tx) => {
    await tx.cookLog.delete({ where: { id: logId } });

    const remaining = await tx.cookLog.findFirst({
      where: { recipeId: id },
      orderBy: { cookedAt: "desc" },
    });

    await tx.recipe.update({
      where: { id },
      data: {
        cookCount: { decrement: 1 },
        lastCookedAt: remaining?.cookedAt ?? null,
      },
    });
  });

  return NextResponse.json({ success: true });
}
