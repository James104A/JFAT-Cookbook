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
      <header className="border-b border-border bg-background-elevated/60 backdrop-blur-md px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Left flourish */}
            <svg className="hidden h-6 w-8 text-accent-amber/50 sm:block" viewBox="0 0 32 24" fill="none">
              <path d="M28 12 C22 4, 14 2, 8 6 S2 14, 6 18 C10 22, 18 20, 22 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
            </svg>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
              JFAT Cookbook
            </h1>
            {/* Right flourish */}
            <svg className="hidden h-6 w-8 -scale-x-100 text-accent-amber/50 sm:block" viewBox="0 0 32 24" fill="none">
              <path d="M28 12 C22 4, 14 2, 8 6 S2 14, 6 18 C10 22, 18 20, 22 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
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
