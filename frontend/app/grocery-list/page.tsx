"use client";

import { Recipe } from "@/types/recipes";
import { useFlags } from "launchdarkly-react-client-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function GroceryListPage() {
  const flags = useFlags();
  const groceryListEnabled = flags?.groceryList === true;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [groceryList, setGroceryList] = useState<Record<string, string[]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/recipe/?limit=100`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load recipes");
        return res.json();
      })
      .then((data) => setRecipes(data.data))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load recipes")
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleRecipe = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === recipes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(recipes.map((r) => r.id).filter(Boolean)));
    }
  };

  const handleGenerate = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      setError("Select at least one recipe");
      return;
    }
    setSubmitting(true);
    setError(null);
    setGroceryList(null);
    try {
      const res = await fetch(`${API_BASE}/grocerylist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate grocery list");
      }
      const list = await res.json();
      setGroceryList(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate grocery list");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to recipes
      </Link>

      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Grocery List
      </h1>

      {!groceryListEnabled && (
        <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground">
          This feature is not currently available.
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!groceryListEnabled ? null : loading ? (
        <p className="text-muted-foreground">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-muted-foreground">
          No recipes yet. Add recipes first to generate a grocery list.
        </p>
      ) : (
        <>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Select recipes to include
              </span>
              <button
                type="button"
                onClick={selectAll}
                className="text-sm font-medium text-primary hover:underline"
              >
                {selectedIds.size === recipes.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {recipes.map((r) => (
                <label
                  key={r.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-card-hover"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(r.id)}
                    onChange={() => toggleRecipe(r.id)}
                    className="h-4 w-4 shrink-0 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-foreground">{r.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting || selectedIds.size === 0}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Generating..." : "Generate grocery list"}
          </button>
        </>
      )}

      {groceryList && Object.keys(groceryList).length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Your list</h2>
          <ul className="space-y-3 rounded-xl border border-border bg-card p-4">
            {Object.entries(groceryList)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, quantities]) => (
                <li
                  key={name}
                  className="flex justify-between text-foreground"
                >
                  <span className="capitalize">{name}</span>
                  <span className="text-muted-foreground">
                    {quantities.join(" + ")}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </article>
  );
}
