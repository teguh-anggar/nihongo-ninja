"use client";

import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: "pink" | "green" | "gold" | "blue";
  className?: string;
}

const colorMap = {
  pink: "bg-primary-500",
  green: "bg-secondary-500",
  gold: "bg-accent-500",
  blue: "bg-info-500",
};

export function ProgressBar({ value, max, label, color = "pink", className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between mb-1 text-body-sm font-semibold">
          <span className="text-text-muted">{label}</span>
          <span className="text-text">{value}/{max}</span>
        </div>
      )}
      <div className="w-full h-3 bg-surface-raised rounded-kid-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className={cn("h-full rounded-kid-full transition-all duration-500 ease-out", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
