"use client";

import { cn } from "@/lib/utils/cn";
import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: "pink" | "green" | "gold";
}

export function Card({ children, hover = false, glow, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-kid-lg p-kid-4 shadow-kid-card border border-border",
        hover && "hover:shadow-kid-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer",
        glow === "pink" && "hover:shadow-kid-glow-pink",
        glow === "green" && "hover:shadow-kid-glow-green",
        glow === "gold" && "hover:shadow-kid-glow-gold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
