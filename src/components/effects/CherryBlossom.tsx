"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CherryBlossom() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: 12 + Math.random() * 16,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}
