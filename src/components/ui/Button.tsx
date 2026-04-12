"use client";

import { cn } from "@/lib/utils/cn";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantStyles = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-kid-button hover:shadow-kid-button-hover",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-kid-button",
  accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-kid-button",
  ghost: "bg-transparent text-text hover:bg-surface-raised",
  danger: "bg-error text-white hover:opacity-90 shadow-kid-button",
};

const sizeStyles = {
  sm: "px-kid-2 py-kid-1 text-body-sm rounded-kid-md min-h-[44px]",
  md: "px-kid-4 py-kid-2 text-body-md font-bold rounded-kid-lg min-h-[48px]",
  lg: "px-kid-6 py-kid-3 text-body-lg font-bold rounded-kid-xl min-h-[56px]",
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
