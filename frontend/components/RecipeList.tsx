"use client";

import { Recipe } from "@/types/recipes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import RecipeCard from "./RecipeCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const cursorRef = useRef(0);
  const searchRef = useRef("");
  const loadingRef = useRef(false);

  const fetchRecipes = useCallback(async (reset: boolean = false) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setError(null);
    if (reset) {
      cursorRef.current = 0;
      setRecipes([]);
    }
    try {
      const params = new URLSearchParams({
        cursor: String(cursorRef.current),
        limit: "10",
      });
      if (searchRef.current) params.set("search", searchRef.current);
      const res = await fetch(`${API_BASE}/recipe/?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecipes((prev) => (reset ? data.data : [...prev, ...data.data]));
      cursorRef.current = data.next_cursor;
      setHasMore(data.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchRecipes(true);
  }, [fetchRecipes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRef.current = searchInput;
    fetchRecipes(true);
  };

  return (
    <div className="w-1/2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your Recipes
        </h1>
        <Link
          href="/recipes/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create recipe
        </Link>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          placeholder="Search recipes..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
        >
          Search
        </button>
      </form>
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
          next={() => fetchRecipes(false)}
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