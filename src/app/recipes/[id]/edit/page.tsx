import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RecipeForm } from "@/components/recipe-form";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-background-elevated/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <a
            href={`/recipes/${id}`}
            className="text-sm text-accent-amber hover:text-accent-amber-light"
          >
            &larr; Back to Recipe
          </a>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Edit Recipe
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <RecipeForm recipe={recipe} />
      </div>
    </main>
  );
}
