import { prisma } from "@/lib/prisma";
import { RecipeLibrary } from "@/components/recipe-library";

export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-background-elevated/80 backdrop-blur-sm px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
            Go-To Recipes
          </h1>
          <a
            href="/recipes/new"
            className="rounded-lg bg-accent-amber px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light"
          >
            + Add Recipe
          </a>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <RecipeLibrary initialRecipes={recipes} />
      </div>
    </main>
  );
}
