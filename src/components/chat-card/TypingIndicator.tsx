export default function TypingIndicator() {
  return (
    <div className="gap-2 flex items-center space-x-1 text-foreground text-sm italic bg-card rounded-full px-4 py-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
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