import Link from "next/link";

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageShell({
  children,
  backHref,
  backLabel = "← Back to recipes",
}: PageShellProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {backLabel}
        </Link>
      )}
      {children}
    </article>
  );
}
