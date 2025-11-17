export function LoadingIndicator() {
  return (
    <div className="gap-2 flex items-center space-x-1 text-foreground text-sm italic bg-card rounded-full px-4 py-2">
      <span>Думаю</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}