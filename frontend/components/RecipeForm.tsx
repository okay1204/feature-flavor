"use client";

import { Ingredient } from "@/types/recipes";
import Link from "next/link";
import { useState } from "react";
import { ErrorAlert } from "./ui";

const INPUT_CLASS =
  "rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const INPUT_FULL = `w-full ${INPUT_CLASS}`;

interface RecipeFormProps {
  initialName?: string;
  initialDescription?: string;
  initialInstructions?: string;
  initialIngredients?: Ingredient[];
  submitLabel: string;
  submittingLabel?: string;
  cancelHref: string;
  cancelLabel?: string;
  onSubmit: (data: {
    name: string;
    description: string;
    instructions: string;
    ingredients: Ingredient[];
  }) => Promise<void>;
}

export function RecipeForm({
  initialName = "",
  initialDescription = "",
  initialInstructions = "",
  initialIngredients = [{ name: "", quantity: "" }],
  submitLabel,
  submittingLabel = "Saving...",
  cancelHref,
  cancelLabel = "Cancel",
  onSubmit,
}: RecipeFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [instructions, setInstructions] = useState(initialInstructions);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
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

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        ingredients: validIngredients,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert message={error} />}

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
          className={INPUT_FULL}
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
          className={INPUT_FULL}
          placeholder="Brief description of the dish"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">Ingredients</label>
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
                className={`flex-1 ${INPUT_CLASS}`}
              />
              <input
                type="text"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                className={`w-28 ${INPUT_CLASS}`}
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
          className={INPUT_FULL}
          placeholder="Step-by-step instructions..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
        >
          {cancelLabel}
        </Link>
      </div>
    </form>
  );
}
