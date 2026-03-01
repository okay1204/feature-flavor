"use client";

import { GroceryListContent } from "@/components/GroceryListContent";
import { ErrorAlert, LoadingState, PageShell } from "@/components/ui";
import { Recipe } from "@/types/recipes";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useEffect, useState } from "react";

export default function GroceryListPage() {
  const flags = useFlags();
  const groceryListEnabled = flags?.groceryList === true;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/?limit=100`)
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

  return (
    <PageShell backHref="/">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Grocery List
      </h1>

      {!groceryListEnabled && (
        <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground">
          This feature is not currently available.
        </p>
      )}

      {groceryListEnabled && error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {groceryListEnabled &&
        (loading ? (
          <LoadingState message="Loading recipes..." />
        ) : recipes.length === 0 ? (
          <p className="text-muted-foreground">
            No recipes yet. Add recipes first to generate a grocery list.
          </p>
        ) : (
          <GroceryListContent recipes={recipes} onError={setError} />
        ))}
    </PageShell>
  );
}
