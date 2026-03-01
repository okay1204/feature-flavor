"use client";

import { useState } from "react";
import { Ingredient } from "@/types/recipes";

interface IngredientItemProps {
  ingredient: Ingredient;
}

export function IngredientItem({ ingredient }: IngredientItemProps) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-card-hover">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        className="h-4 w-4 shrink-0 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
      />
      <span
        className={
          checked ? "text-muted-foreground line-through" : "text-foreground"
        }
      >
        {ingredient.name}
      </span>
      <span className="ml-auto text-muted-foreground">{ingredient.quantity}</span>
    </label>
  );
}
