"use client";

import { Recipe } from "@/generated/prisma/client";
import { getRecipeImage } from "@/lib/recipe-images";

interface RecipeDetailProps {
  recipe: Recipe;
  canEdit?: boolean;
}

export function RecipeDetail({ recipe, canEdit = false }: RecipeDetailProps) {
  const highlights: string[] = recipe.highlights
    ? JSON.parse(recipe.highlights)
    : [];
  const ingredients: string[] = recipe.ingredients
    ? JSON.parse(recipe.ingredients)
    : [];
  const steps: string[] = recipe.steps ? JSON.parse(recipe.steps) : [];
  const image = getRecipeImage(recipe);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <a
        href="/"
        className="text-sm text-accent-amber hover:text-accent-amber-light"
      >
        &larr; Back to Library
      </a>

      {/* Hero image */}
      <div className="mt-4 h-64 w-full overflow-hidden rounded-xl">
        {image.type === "url" ? (
          <img
            src={image.url}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${image.colors[0]}, ${image.colors[1]})`,
            }}
          />
        )}
      </div>

      <div className="mt-6 flex items-start justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
          {recipe.title}
        </h1>
        {canEdit && (
          <a
            href={`/recipes/${recipe.id}/edit`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
          >
            Edit
          </a>
        )}
      </div>

      {/* Go-to signals */}
      <div className="mt-4 flex items-center gap-4">
        {recipe.rating != null && (
          <span className="text-accent-copper">
            {"★".repeat(recipe.rating)}
            {"☆".repeat(5 - recipe.rating)}
          </span>
        )}
        <button className="rounded-lg bg-accent-sage/20 px-3 py-1 text-sm text-accent-sage-light transition-colors hover:bg-accent-sage/30">
          Cooked it! ({recipe.cookCount})
        </button>
        <button className="text-sm text-foreground-muted transition-colors hover:text-accent-copper">
          {recipe.isFavorite ? "★ Favorited" : "☆ Favorite"}
        </button>
      </div>

      {/* Linked recipe: external link */}
      {recipe.recipeType === "linked" && recipe.url && (
        <div className="mt-6">
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-accent-amber px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light"
          >
            Open Original Recipe &rarr;
          </a>
        </div>
      )}

      {recipe.descriptionShort && (
        <p className="mt-6 text-foreground-muted">{recipe.descriptionShort}</p>
      )}

      {highlights.length > 0 && (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Highlights
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-foreground-muted">
            {highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {ingredients.length > 0 && (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Ingredients
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-foreground-muted">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Steps
          </h2>
          <ol className="mt-3 list-inside list-decimal space-y-2.5 text-foreground-muted">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {recipe.personalNotes && (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Personal Notes
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-foreground-muted">
            {recipe.personalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
