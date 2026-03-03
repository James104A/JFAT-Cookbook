import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { RecipeLibrary } from "@/components/recipe-library";
import { LogoutButton } from "@/components/logout-button";
import { MarginDecorations } from "@/components/margin-decorations";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recipes, authed] = await Promise.all([
    prisma.recipe.findMany({
      orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
    }),
    isAuthenticated(),
  ]);

  return (
    <main className="relative min-h-screen">
      <MarginDecorations />
      <header className="relative overflow-hidden border-b border-border bg-background-elevated/60 backdrop-blur-md px-6 py-6">
        {/* Decorative corner flourishes */}
        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-32 opacity-[0.07]"
          viewBox="0 0 120 80"
          fill="none"
          preserveAspectRatio="xMinYMid meet"
        >
          <path
            d="M-10 80 C10 60, 20 40, 15 20 S30 -5, 50 5 C60 10, 55 25, 45 30 S25 35, 20 50 C15 60, 25 70, 40 65"
            stroke="var(--accent-amber)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-5 75 C5 65, 10 50, 8 35 S18 10, 30 15 C38 18, 35 30, 28 33"
            stroke="var(--accent-copper)"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="50" cy="5" r="2" fill="var(--accent-amber)" />
          <circle cx="45" cy="30" r="1.5" fill="var(--accent-sage)" />
          <circle cx="20" cy="50" r="1.5" fill="var(--accent-copper)" />
        </svg>
        <svg
          className="pointer-events-none absolute top-0 right-0 h-full w-32 -scale-x-100 opacity-[0.07]"
          viewBox="0 0 120 80"
          fill="none"
          preserveAspectRatio="xMinYMid meet"
        >
          <path
            d="M-10 80 C10 60, 20 40, 15 20 S30 -5, 50 5 C60 10, 55 25, 45 30 S25 35, 20 50 C15 60, 25 70, 40 65"
            stroke="var(--accent-amber)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-5 75 C5 65, 10 50, 8 35 S18 10, 30 15 C38 18, 35 30, 28 33"
            stroke="var(--accent-copper)"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="50" cy="5" r="2" fill="var(--accent-amber)" />
          <circle cx="45" cy="30" r="1.5" fill="var(--accent-sage)" />
          <circle cx="20" cy="50" r="1.5" fill="var(--accent-copper)" />
        </svg>

        {/* Subtle sparkle dots */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-3 left-[15%] h-1 w-1 rounded-full bg-accent-amber opacity-15" />
          <div className="absolute top-5 left-[25%] h-0.5 w-0.5 rounded-full bg-accent-copper opacity-20" />
          <div className="absolute bottom-3 left-[20%] h-0.5 w-0.5 rounded-full bg-accent-sage opacity-15" />
          <div className="absolute top-4 right-[18%] h-1 w-1 rounded-full bg-accent-amber opacity-15" />
          <div className="absolute bottom-4 right-[25%] h-0.5 w-0.5 rounded-full bg-accent-copper opacity-20" />
          <div className="absolute top-6 right-[12%] h-0.5 w-0.5 rounded-full bg-accent-sage opacity-15" />
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Left flourish */}
            <svg className="hidden h-6 w-8 text-accent-amber/25 sm:block" viewBox="0 0 32 24" fill="none">
              <path d="M28 12 C22 4, 14 2, 8 6 S2 14, 6 18 C10 22, 18 20, 22 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
            </svg>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
              JFAT Cookbook
            </h1>
            {/* Right flourish */}
            <svg className="hidden h-6 w-8 -scale-x-100 text-accent-amber/25 sm:block" viewBox="0 0 32 24" fill="none">
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
