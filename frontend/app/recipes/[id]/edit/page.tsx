"use client";

import { RecipeForm } from "@/components/RecipeForm";
import { ErrorAlert, LoadingState, PageShell } from "@/components/ui";
import { Ingredient, Recipe } from "@/types/recipes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then((data: Recipe) => setRecipe(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    instructions: string;
    ingredients: Ingredient[];
  }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update recipe");
    router.push(`/recipes/${id}`);
  };

  if (loading) return <LoadingState />;

  if (error && !recipe) {
    return (
      <PageShell backHref="/">
        <ErrorAlert message={error} />
      </PageShell>
    );
  }

  if (!recipe) return null;

  return (
    <PageShell backHref={`/recipes/${id}`} backLabel="← Back to recipe">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Edit Recipe
      </h1>
      <RecipeForm
        initialName={recipe.name}
        initialDescription={recipe.description || ""}
        initialInstructions={recipe.instructions || ""}
        initialIngredients={
          recipe.ingredients?.length
            ? recipe.ingredients.map((i) => ({ name: i.name, quantity: i.quantity }))
            : [{ name: "", quantity: "" }]
        }
        submitLabel="Save changes"
        cancelHref={`/recipes/${id}`}
        cancelLabel="Cancel"
        onSubmit={handleSubmit}
      />
    </PageShell>
  );
}
