"use client";

import { useReducer, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer } from "@/lib/game-engine/reducer";
import { createInitialState } from "@/types/game";
import { shuffle } from "@/lib/game-engine/shuffle";
import { saveGameResult } from "@/lib/progress/storage";
import { katakanaBasic } from "@/lib/game-data/katakana";
import { GameComplete } from "@/components/game/GameComplete";
import { Button } from "@/components/ui/Button";
import { useSoundContext } from "@/providers/SoundProvider";
import confetti from "canvas-confetti";

interface MatchCard {
  id: string;
  content: string;
  type: "character" | "romaji";
  pairId: string;
  flipped: boolean;
  matched: boolean;
}

export default function KatakanaPage() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState("katakana", "easy"));
  const { playSound } = useSoundContext();
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [canFlip, setCanFlip] = useState(true);

  const startGame = useCallback(() => {
    const subset = shuffle(katakanaBasic).slice(0, 6);
    const newCards: MatchCard[] = subset.flatMap((c) => [
      { id: `char-${c.character}`, content: c.character, type: "character" as const, pairId: c.romaji, flipped: false, matched: false },
      { id: `rom-${c.character}`, content: c.romaji, type: "romaji" as const, pairId: c.romaji, flipped: false, matched: false },
    ]);
    setCards(shuffle(newCards));
    setFlipped([]);
    setCanFlip(true);
    dispatch({
      type: "START_GAME",
      payload: {
        questions: subset.map((c, i) => ({
          id: `k-${i}`,
          type: "matching" as const,
          prompt: c.character,
          correctAnswer: c.romaji,
        })),
      },
    });
  }, []);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (!canFlip) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.matched || card.flipped || flipped.includes(cardId)) return;
      if (flipped.length >= 2) return;

      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setCanFlip(false);
        const [firstId, secondId] = newFlipped;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;

        if (first.pairId === second.pairId && first.type !== second.type) {
          // Match!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
              )
            );
            dispatch({ type: "MATCH_PAIR", payload: { id1: firstId, id2: secondId } });
            playSound("correct");
            confetti({ particleCount: 20, spread: 40, colors: ["#f83d82", "#45a668"] });
            setFlipped([]);
            setCanFlip(true);
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            playSound("wrong");
            setFlipped([]);
            setCanFlip(true);
          }, 1000);
        }
      }
    },
    [cards, flipped, canFlip, playSound]
  );

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      dispatch({ type: "COMPLETE_GAME" });
    }
  }, [cards]);

  useEffect(() => {
    if (state.phase === "complete" && state.startTime) {
      saveGameResult(state);
      confetti({ particleCount: 100, spread: 100, colors: ["#f83d82", "#45a668", "#f59e07"] });
    }
  }, [state.phase, state.startTime]);

  if (state.phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-kid-4 gap-kid-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">
          🔗
        </motion.div>
        <h1 className="text-heading-xl font-bold text-text text-center">Katakana Matching</h1>
        <p className="text-body-lg text-text-muted text-center max-w-md">
          Flip cards to find matching katakana and romaji pairs. Find all pairs to win!
        </p>
        <Button variant="secondary" size="lg" onClick={startGame}>
          Start Matching!
        </Button>
      </div>
    );
  }

  if (state.phase === "complete") {
    return (
      <GameComplete
        score={state.score}
        correctCount={state.correctCount}
        incorrectCount={0}
        totalQuestions={state.questions.length}
        bestStreak={state.bestStreak}
        onPlayAgain={startGame}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-kid-4 py-kid-4">
      <div className="flex items-center justify-between mb-kid-4 bg-surface rounded-kid-lg shadow-kid-card p-kid-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-heading-md font-bold text-accent-500">{state.score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <span className="text-body-md font-semibold text-text-muted">
            {cards.filter((c) => c.matched).length / 2}/{cards.length / 2} pairs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-kid-3">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => handleCardClick(card.id)}
              disabled={card.matched || flipped.includes(card.id)}
              className={`aspect-square rounded-kid-lg font-bold text-2xl transition-all duration-200 cursor-pointer min-h-[80px] flex items-center justify-center ${
                card.matched
                  ? "bg-secondary-100 text-secondary-700 border-2 border-secondary-300 scale-95"
                  : flipped.includes(card.id)
                  ? "bg-primary-50 text-primary-700 border-2 border-primary-300 shadow-kid-glow-pink"
                  : "bg-surface shadow-kid-card border-2 border-border hover:shadow-kid-card-hover hover:-translate-y-0.5"
              }`}
              aria-label={card.matched || flipped.includes(card.id) ? card.content : "Hidden card"}
            >
              <span className={card.type === "character" ? "font-japanese" : ""}>
                {card.matched || flipped.includes(card.id) ? card.content : "?"}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
