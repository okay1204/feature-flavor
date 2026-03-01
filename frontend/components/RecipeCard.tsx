import { Recipe } from "@/types/recipes";
import Link from "next/link";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <Link
            href={`/recipes/${recipe.id}`}
            className="block rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-zinc-600 hover:bg-card-hover"
        >
            <h2 className="font-medium text-foreground">
                {recipe.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {recipe.description || "No description"}
            </p>
        </Link>
    );
}