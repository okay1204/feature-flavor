"use client";

import { Recipe } from "@/types/recipes";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface GroceryListContentProps {
  recipes: Recipe[];
  onError: (message: string) => void;
}

export function GroceryListContent({
  recipes,
  onError,
}: GroceryListContentProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [groceryList, setGroceryList] = useState<Record<string, string[]> | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

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
      onError("Select at least one recipe");
      return;
    }
    setSubmitting(true);
    onError("");
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
      onError(e instanceof Error ? e.message : "Failed to generate grocery list");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            {selectedIds.size === recipes.length ? "Deselect all" : "Select all"}
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

      {groceryList && Object.keys(groceryList).length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Your list</h2>
          <ul className="space-y-3 rounded-xl border border-border bg-card p-4">
            {Object.entries(groceryList)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, quantities]) => (
                <li key={name} className="flex justify-between text-foreground">
                  <span className="capitalize">{name}</span>
                  <span className="text-muted-foreground">
                    {quantities.join(" + ")}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}
