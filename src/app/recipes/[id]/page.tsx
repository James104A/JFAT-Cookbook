import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { RecipeDetail } from "@/components/recipe-detail";
import { MarginDecorations } from "@/components/margin-decorations";

export const dynamic = "force-dynamic";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  const [recipe, authed] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id },
      include: { cookLogs: { orderBy: { cookedAt: "desc" } } },
    }),
    isAuthenticated(),
  ]);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="relative min-h-screen">
      <MarginDecorations />
      <RecipeDetail recipe={recipe} canEdit={authed} />
    </main>
  );
}
