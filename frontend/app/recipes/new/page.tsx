"use client";

import { RecipeForm } from "@/components/RecipeForm";
import { PageShell } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    name: string;
    description: string;
    instructions: string;
    ingredients: { name: string; quantity: string }[];
  }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create recipe");
    const { recipe_id } = await res.json();
    router.push(`/recipes/${recipe_id}`);
  };

  return (
    <PageShell backHref="/">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        New Recipe
      </h1>
      <RecipeForm
        submitLabel="Create recipe"
        submittingLabel="Creating..."
        cancelHref="/"
        onSubmit={handleSubmit}
      />
    </PageShell>
  );
}
