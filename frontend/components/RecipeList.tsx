"use client";

import { Recipe } from "@/types/recipes";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RecipeCard from "./RecipeCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function RecipeList() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const cursorRef = useRef(0);
    const loadingRef = useRef(false);

    const fetchRecipes = useCallback(async () => {
        if (loadingRef.current) return;
        
        loadingRef.current = true;
        setError(null);
        try {
            const params = new URLSearchParams({
                cursor: String(cursorRef.current),
                limit: "10",
            });
            const res = await fetch(`${API_BASE}/recipe/?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setRecipes((prev) => [...prev, ...data.data]);
            cursorRef.current = data.next_cursor;
            setHasMore(data.has_more);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            loadingRef.current = false;
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return (
        <div className="w-1/2 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Your Recipes
            </h1>
            {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </p>
            )}
            <div
                id="recipe-scroll"
                className="-mx-1 max-h-[70vh] overflow-y-auto px-1"
            >
                <InfiniteScroll
                    dataLength={recipes.length}
                    next={fetchRecipes}
                    hasMore={hasMore}
                    loader={
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Loading more...
                        </p>
                    }
                    scrollableTarget="recipe-scroll"
                >
                    <div className="space-y-3">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}