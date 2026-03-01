interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  );
}
