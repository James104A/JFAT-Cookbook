"use client";

import { useState } from "react";
import { Recipe } from "@/generated/prisma/client";
import { RecipeType } from "@/types/recipe";

interface RecipeFormProps {
  recipe?: Recipe;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const [recipeType, setRecipeType] = useState<RecipeType>(
    (recipe?.recipeType as RecipeType) ?? "linked"
  );

  const isEditing = !!recipe;

  // TODO: Implement full form state, submission, and AI summarization trigger

  return (
    <div className="space-y-6">
      {/* Recipe type selector (only for new recipes) */}
      {!isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setRecipeType("linked")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              recipeType === "linked"
                ? "bg-accent-amber text-background"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Linked Recipe
          </button>
          <button
            onClick={() => setRecipeType("native")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              recipeType === "native"
                ? "bg-accent-amber text-background"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Native Recipe
          </button>
        </div>
      )}

      <form className="space-y-4">
        {/* Linked: URL input + AI summary trigger */}
        {recipeType === "linked" && (
          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Recipe URL
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/recipe..."
                className="flex-1 rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
              />
              <button
                type="button"
                className="rounded-lg bg-accent-amber px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light"
              >
                Generate Summary
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            Title
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            Short Description
          </label>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
          />
        </div>

        {/* Native: Ingredients + Steps */}
        {recipeType === "native" && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground-muted">
                Ingredients (one per line)
              </label>
              <textarea
                rows={6}
                className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 font-mono text-sm text-foreground focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-muted">
                Steps (one per line)
              </label>
              <textarea
                rows={6}
                className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
              />
            </div>
          </>
        )}

        {/* Personal Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            Personal Notes
          </label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-amber/50 focus:outline-none focus:ring-1 focus:ring-accent-amber/30"
          />
        </div>

        {/* Tags section */}
        <div className="rounded-xl border border-border bg-background-elevated/50 p-4">
          <h3 className="text-sm font-medium text-foreground-muted">
            Tags & Metadata
          </h3>
          <p className="mt-1 text-xs text-foreground-muted">
            Season, Cuisine, Dish Type, Good For, Dietary, Protein, Time,
            Servings
          </p>
          {/* TODO: Implement multi-select tag components */}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="rounded-lg bg-accent-amber px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light"
          >
            {isEditing ? "Save Changes" : "Add Recipe"}
          </button>
          <a
            href={isEditing ? `/recipes/${recipe.id}` : "/"}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
