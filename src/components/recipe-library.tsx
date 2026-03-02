"use client";

import { useMemo, useState } from "react";
import { Recipe } from "@/generated/prisma/client";
import { SearchBar } from "./search-bar";
import { FilterPanel } from "./filter-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeFilters, SortOption } from "@/types/recipe";

interface RecipeLibraryProps {
  initialRecipes: Recipe[];
}

type FilterCategory = keyof RecipeFilters;

const FILTER_TO_FIELD: [FilterCategory, keyof Recipe][] = [
  ["seasons", "seasonTags"],
  ["dishTypes", "dishTypes"],
  ["cuisines", "cuisineTypes"],
  ["goodFor", "goodForTags"],
  ["dietary", "dietaryTags"],
  ["proteins", "mainIngredientTags"],
];

export function RecipeLibrary({ initialRecipes }: RecipeLibraryProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<RecipeFilters>({});

  const toggleFilter = (category: FilterCategory, value: string) => {
    setFilters((prev) => {
      const current = (prev[category] as string[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next.length > 0 ? next : undefined };
    });
  };

  const clearFilters = () => setFilters({});

  const filteredRecipes = useMemo(() => {
    let results = initialRecipes;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter((r) => {
        const searchable = [
          r.title,
          r.descriptionShort ?? "",
          r.cuisineTypes ?? "",
          r.dishTypes ?? "",
          r.goodForTags ?? "",
          r.seasonTags ?? "",
          r.dietaryTags ?? "",
          r.mainIngredientTags ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }

    // Cook status filter
    const cookStatus = filters.cookStatus;
    if (cookStatus && cookStatus.length === 1) {
      if (cookStatus[0] === "Cooked") {
        results = results.filter((r) => r.cookCount > 0);
      } else {
        results = results.filter((r) => r.cookCount === 0);
      }
    }

    // Category filters: AND across, OR within
    for (const [filterKey, recipeField] of FILTER_TO_FIELD) {
      const selected = filters[filterKey] as string[] | undefined;
      if (selected && selected.length > 0) {
        results = results.filter((r) => {
          const raw = r[recipeField];
          const values: string[] =
            typeof raw === "string" ? JSON.parse(raw) : [];
          // Recipes tagged "Any" season match all season filters
          if (filterKey === "seasons" && values.includes("Any")) return true;
          return selected.some((s) => values.includes(s));
        });
      }
    }

    // Sort
    results = [...results].sort((a, b) => {
      // Favorites always first
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      switch (sortBy) {
        case "mostCooked":
          return b.cookCount - a.cookCount;
        case "highestRated":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "prepTime":
          return (a.totalTimeMinutes ?? 999) - (b.totalTimeMinutes ?? 999);
        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return results;
  }, [initialRecipes, search, filters, sortBy]);

  const activeFilterEntries = Object.entries(filters).filter(
    ([, v]) => Array.isArray(v) && v.length > 0
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              showFilters
                ? "border-accent-amber/50 text-accent-amber"
                : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground-muted"
          >
            <option value="recent">Recently Added</option>
            <option value="mostCooked">Most Cooked</option>
            <option value="highestRated">Highest Rated</option>
            <option value="prepTime">Prep Time</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            {viewMode === "grid" ? "List" : "Grid"}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onToggleFilter={toggleFilter}
          onClearAll={clearFilters}
        />
      )}

      {/* Active filter chips */}
      {activeFilterEntries.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-foreground-muted">Active:</span>
          {activeFilterEntries.map(([category, values]) =>
            (values as string[]).map((value) => (
              <button
                key={`${category}-${value}`}
                onClick={() => toggleFilter(category as FilterCategory, value)}
                className="flex items-center gap-1 rounded-full bg-accent-amber/20 px-3 py-1 text-xs text-accent-amber-light hover:bg-accent-amber/30"
              >
                {value}
                <span className="ml-0.5">&times;</span>
              </button>
            ))
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-foreground-muted underline hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Recipe grid / list */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} viewMode={viewMode} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <p className="py-12 text-center text-foreground-muted">
          No recipes found. Try adjusting your filters or add a new recipe.
        </p>
      )}
    </div>
  );
}
