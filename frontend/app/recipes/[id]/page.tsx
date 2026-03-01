"use client";

import { Recipe } from "@/types/recipes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/recipe/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const toggleIngredient = useCallback((i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/recipe/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then(setRecipe)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error || "Recipe not found"}
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to recipes
      </Link>

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
              href={`/recipes/${id}/edit`}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-medium text-foreground">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-card-hover"
                >
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggleIngredient(i)}
                    className="h-4 w-4 shrink-0 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span
                    className={checked.has(i) ? "text-muted-foreground line-through" : "text-foreground"}
                  >
                    {ing.name}
                  </span>
                  <span className="ml-auto text-muted-foreground">{ing.quantity}</span>
                </label>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-lg font-medium text-foreground">
            Instructions
          </h2>
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {recipe.instructions || "No instructions provided."}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
