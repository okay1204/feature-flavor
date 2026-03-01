"use client";

import { IngredientItem } from "@/components/IngredientItem";
import { RecipeHeader } from "@/components/RecipeHeader";
import { ErrorAlert, LoadingState, PageShell } from "@/components/ui";
import { Recipe } from "@/types/recipes";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const ldClient = useLDClient();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        ldClient?.track("view_recipe", {
          recipeId: parseInt(id, 10),
          recipeName: data.name,
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, ldClient]);

  if (loading) return <LoadingState />;

  if (error || !recipe) {
    return (
      <PageShell backHref="/">
        <ErrorAlert message={error || "Recipe not found"} />
      </PageShell>
    );
  }

  return (
    <PageShell backHref="/">
      <RecipeHeader
        recipe={recipe}
        recipeId={id}
        onDelete={handleDelete}
        deleting={deleting}
      />
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-medium text-foreground">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing, i) => (
              <IngredientItem key={i} ingredient={ing} />
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-medium text-foreground">Instructions</h2>
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {recipe.instructions ?? "No instructions provided."}
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
