interface RecipeInstructionsProps {
  instructions: string | null | undefined;
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-medium text-foreground">Instructions</h2>
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {instructions || "No instructions provided."}
        </p>
      </div>
    </section>
  );
}
