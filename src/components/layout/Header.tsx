"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";

const navItems = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/hiragana", label: "Hiragana", emoji: "あ" },
  { href: "/katakana", label: "Katakana", emoji: "ア" },
  { href: "/vocabulary", label: "Words", emoji: "📚" },
  { href: "/drag-drop", label: "Match", emoji: "🎯" },
  { href: "/progress", label: "Progress", emoji: "⭐" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-kid-4 py-kid-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-kid-2 no-underline">
          <span className="text-3xl">🥷</span>
          <span className="font-display text-heading-md font-bold text-primary-500">
            Nihongo Ninja
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-kid-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-kid-3 py-kid-1 rounded-kid-md text-body-sm font-semibold text-text-muted hover:bg-surface-raised hover:text-primary-500 transition-colors no-underline min-h-touch"
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-kid-2">
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto px-kid-2 pb-kid-2 gap-kid-1 scrollbar-none" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1 px-kid-2 py-kid-1 rounded-kid-md text-body-sm font-semibold text-text-muted hover:bg-surface-raised hover:text-primary-500 transition-colors whitespace-nowrap no-underline min-h-touch"
          >
            <span>{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
