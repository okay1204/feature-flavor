import { RecipeList } from "@/components/RecipeList";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <RecipeList />
      </div>
    </main>
  );
}
