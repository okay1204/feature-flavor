import { Recipe } from "@/types/recipes";
import Link from "next/link";

interface RecipeHeaderProps {
  recipe: Recipe;
  recipeId: string;
  onDelete: () => void;
  deleting?: boolean;
}

export function RecipeHeader({
  recipe,
  recipeId,
  onDelete,
  deleting = false,
}: RecipeHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/recipes/${recipeId}/edit`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </header>
  );
}
