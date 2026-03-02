import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RecipeDetail } from "@/components/recipe-detail";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <RecipeDetail recipe={recipe} />
    </main>
  );
}
