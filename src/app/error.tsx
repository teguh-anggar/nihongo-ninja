"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-kid-4 text-center px-kid-4">
        <span className="text-6xl">😵</span>
        <h2 className="text-heading-lg font-bold text-text">Oops! Something went wrong</h2>
        <p className="text-body-md text-text-muted max-w-md">
          Even ninjas stumble sometimes. Let&apos;s try again!
        </p>
        <button
          onClick={reset}
          className="px-kid-4 py-kid-2 bg-primary-500 text-white rounded-kid-lg font-bold text-body-lg hover:bg-primary-600 transition-colors min-h-touch cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
