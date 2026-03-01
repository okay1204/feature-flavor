"use client";

import { Ingredient } from "@/types/recipes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);
  };

  const updateIngredient = (i: number, field: "name" | "quantity", value: string) => {
    setIngredients((prev) =>
      prev.map((ing, j) => (j === i ? { ...ing, [field]: value } : ing))
    );
  };

  const removeIngredient = (i: number) => {
    setIngredients((prev) => prev.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    try {
      const res = await fetch(`${API_BASE}/recipe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          instructions: instructions.trim(),
          ingredients: validIngredients,
        }),
      });
      if (!res.ok) throw new Error("Failed to create recipe");
      const data = await res.json();
      router.push(`/recipes/${data.recipe_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
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
        New Recipe
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Spaghetti Carbonara"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Brief description of the dish"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              Ingredients
            </label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm font-medium text-primary hover:underline"
            >
              + Add ingredient
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                  className="w-28 rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="rounded-lg border border-border px-3 py-3 text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="instructions" className="mb-1 block text-sm font-medium text-foreground">
            Instructions *
          </label>
          <textarea
            id="instructions"
            required
            rows={8}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Step-by-step instructions..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create recipe"}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
          >
            Cancel
          </Link>
        </div>
      </form>
    </article>
  );
}
