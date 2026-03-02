-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "recipeType" TEXT NOT NULL,
    "url" TEXT,
    "descriptionShort" TEXT,
    "highlights" TEXT,
    "ingredients" TEXT,
    "steps" TEXT,
    "personalNotes" TEXT,
    "seasonTags" TEXT,
    "dishTypes" TEXT,
    "cuisineTypes" TEXT,
    "goodForTags" TEXT,
    "dietaryTags" TEXT,
    "mainIngredientTags" TEXT,
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "totalTimeMinutes" INTEGER,
    "servings" TEXT,
    "rating" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "cookCount" INTEGER NOT NULL DEFAULT 0,
    "lastCookedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AISummaryJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" DATETIME,
    "modelUsed" TEXT,
    "rawExtract" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AISummaryJob_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
