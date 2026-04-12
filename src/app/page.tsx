"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CherryBlossom } from "@/components/effects/CherryBlossom";

const gameModes = [
  {
    href: "/hiragana",
    emoji: "🎴",
    title: "Hiragana Flashcards",
    description: "Learn basic Japanese characters with flip cards",
    color: "bg-primary-500",
    glow: "shadow-kid-glow-pink" as const,
    emojiChar: "あ",
  },
  {
    href: "/katakana",
    emoji: "🔗",
    title: "Katakana Matching",
    description: "Match katakana characters to their romaji",
    color: "bg-secondary-500",
    glow: "shadow-kid-glow-green" as const,
    emojiChar: "ア",
  },
  {
    href: "/vocabulary",
    emoji: "📚",
    title: "Vocabulary Quiz",
    description: "Test your Japanese word knowledge",
    color: "bg-accent-500",
    glow: "shadow-kid-glow-gold" as const,
    emojiChar: "語",
  },
  {
    href: "/drag-drop",
    emoji: "🎯",
    title: "Character Match",
    description: "Drag characters to the right spot",
    color: "bg-info-500",
    glow: "" as const,
    emojiChar: "✏️",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
};

export default function HomePage() {
  return (
    <div className="relative">
      <CherryBlossom />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center py-kid-12 px-kid-4">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-8xl mb-kid-4"
        >
          🥷
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-heading-xl font-bold font-display text-text mb-kid-2"
        >
          Nihongo Ninja
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-body-lg text-text-muted max-w-lg mb-kid-8"
        >
          Learn Japanese the fun way! Master hiragana, katakana, and vocabulary through exciting games.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 bg-surface-raised rounded-kid-full px-kid-4 py-kid-2 shadow-kid-card"
        >
          <span className="text-2xl animate-float">🌸</span>
          <span className="text-body-md font-semibold text-primary-500">Choose a game to start!</span>
          <span className="text-2xl animate-float" style={{ animationDelay: "1.5s" }}>🌸</span>
        </motion.div>
      </section>

      {/* Game Mode Grid */}
      <section className="relative z-10 max-w-4xl mx-auto px-kid-4 pb-kid-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-kid-4"
        >
          {gameModes.map((mode) => (
            <motion.div key={mode.href} variants={itemVariants}>
              <Link href={mode.href} className="block no-underline group">
                <div className={`relative overflow-hidden bg-surface rounded-kid-xl p-kid-6 shadow-kid-card border border-border hover:shadow-kid-card-hover hover:-translate-y-1 transition-all duration-200 min-h-[180px] flex flex-col justify-between`}>
                  <div className={`absolute top-4 right-4 w-16 h-16 ${mode.color} opacity-10 rounded-kid-full`} />
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-japanese">{mode.emojiChar}</span>
                      <span className="text-3xl">{mode.emoji}</span>
                    </div>
                    <h3 className="text-heading-md font-bold text-text mb-2 group-hover:text-primary-500 transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-body-sm text-text-muted">{mode.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary-500 font-semibold text-body-sm">
                    Play Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-4xl mx-auto px-kid-4 pb-kid-12">
        <div className="bg-surface rounded-kid-xl p-kid-6 shadow-kid-card border border-border">
          <h2 className="text-heading-lg font-bold text-text mb-kid-4 text-center">Why Nihongo Ninja?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-kid-4 text-center">
            {[
              { emoji: "🎮", label: "Fun Games" },
              { emoji: "📊", label: "Track Progress" },
              { emoji: "🏆", label: "Earn Stars" },
              { emoji: "🥷", label: "Ninja Levels" },
            ].map((feat) => (
              <div key={feat.label} className="flex flex-col items-center gap-2">
                <span className="text-4xl">{feat.emoji}</span>
                <span className="text-body-sm font-semibold text-text-muted">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
