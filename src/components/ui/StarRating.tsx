"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeMap = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" };

export function StarRating({ stars, maxStars = 3, size = "md", animate = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${stars} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < stars;
        return (
          <motion.span
            key={i}
            className={cn(sizeMap[size], filled ? "grayscale-0" : "grayscale opacity-30")}
            initial={animate ? { scale: 0, rotate: -180 } : undefined}
            animate={animate ? { scale: 1, rotate: 0 } : undefined}
            transition={{ delay: i * 0.2, type: "spring", stiffness: 300, damping: 15 }}
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
}
