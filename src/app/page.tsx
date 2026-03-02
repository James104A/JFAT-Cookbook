import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { RecipeLibrary } from "@/components/recipe-library";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recipes, authed] = await Promise.all([
    prisma.recipe.findMany({
      orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
    }),
    isAuthenticated(),
  ]);

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-background-elevated/80 backdrop-blur-sm px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
            Go-To Recipes
          </h1>
          <div className="flex items-center gap-3">
            {authed ? (
              <>
                <a
                  href="/recipes/new"
                  className="rounded-lg bg-accent-amber px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light"
                >
                  + Add Recipe
                </a>
                <LogoutButton />
              </>
            ) : (
              <a
                href="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <RecipeLibrary initialRecipes={recipes} />
      </div>
    </main>
  );
}
