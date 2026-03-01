import { Recipe } from "@/types/recipes";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <div
            className="rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-zinc-600 hover:bg-card-hover"
        >
            <h2 className="font-medium text-foreground">
                {recipe.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {recipe.description || "No description"}
            </p>
        </div>
    );
}