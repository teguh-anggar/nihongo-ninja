export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-kid-4">
        <div className="text-6xl animate-bounce-in">🥷</div>
        <p className="text-body-lg font-semibold text-text-muted animate-pulse-soft">
          Loading...
        </p>
      </div>
    </div>
  );
}
