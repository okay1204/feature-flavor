"use client";

interface RecipeSearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: React.ComponentProps<"form">["onSubmit"];
}

export function RecipeSearchForm({
  value,
  onChange,
  onSubmit,
}: RecipeSearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="search"
        placeholder="Search recipes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
      >
        Search
      </button>
    </form>
  );
}
