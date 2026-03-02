import { RecipeForm } from "@/components/recipe-form";

export default function NewRecipePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-background-elevated/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <a
            href="/"
            className="text-sm text-accent-amber hover:text-accent-amber-light"
          >
            &larr; Back to Library
          </a>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Add New Recipe
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <RecipeForm />
      </div>
    </main>
  );
}
