"use client";

import { useReducer, useCallback, useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer } from "@/lib/game-engine/reducer";
import { createInitialState } from "@/types/game";
import { pickRandom, shuffle } from "@/lib/game-engine/shuffle";
import { saveGameResult } from "@/lib/progress/storage";
import { hiraganaBasic } from "@/lib/game-data/hiragana";
import { GameComplete } from "@/components/game/GameComplete";
import { Button } from "@/components/ui/Button";
import { useSoundContext } from "@/providers/SoundProvider";
import confetti from "canvas-confetti";
import type { CharacterData } from "@/lib/game-data/hiragana";

interface DragItem {
  id: string;
  character: string;
  romaji: string;
  placed: boolean;
  x: number;
  y: number;
}

interface DropZone {
  id: string;
  romaji: string;
  filled: boolean;
}

export default function DragDropPage() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState("drag-drop", "easy"));
  const { playSound } = useSoundContext();
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const gameData = useMemo(() => pickRandom(hiraganaBasic, 5), [state.phase]);

  const startGame = useCallback(() => {
    const items: DragItem[] = shuffle(gameData).map((c, i) => ({
      id: `drag-${i}`,
      character: c.character,
      romaji: c.romaji,
      placed: false,
      x: 0,
      y: 0,
    }));
    const zones: DropZone[] = gameData.map((c, i) => ({
      id: `zone-${i}`,
      romaji: c.romaji,
      filled: false,
    }));
    setDragItems(items);
    setDropZones(zones);
    dispatch({
      type: "START_GAME",
      payload: {
        questions: gameData.map((c, i) => ({
          id: `dd-${i}`,
          type: "drag-drop" as const,
          prompt: c.character,
          correctAnswer: c.romaji,
        })),
      },
    });
  }, [gameData]);

  const handleDrop = useCallback(
    (itemId: string, zoneId: string) => {
      const item = dragItems.find((d) => d.id === itemId);
      const zone = dropZones.find((z) => z.id === zoneId);
      if (!item || !zone || item.placed || zone.filled) return;

      if (item.romaji === zone.romaji) {
        setDragItems((prev) => prev.map((d) => (d.id === itemId ? { ...d, placed: true } : d)));
        setDropZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, filled: true } : z)));
        dispatch({ type: "ANSWER_CORRECT", payload: { questionId: itemId, points: 10 } });
        playSound("correct");
      } else {
        dispatch({ type: "ANSWER_INCORRECT", payload: { questionId: itemId } });
        playSound("wrong");
      }
      setDragging(null);
      setSelectedItem(null);
    },
    [dragItems, dropZones, playSound]
  );

  // Pointer handlers for drag
  const handlePointerDown = useCallback((e: React.PointerEvent, itemId: string) => {
    const item = dragItems.find((d) => d.id === itemId);
    if (!item || item.placed) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(itemId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [dragItems]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [dragging]);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      // Check if over a drop zone
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        for (const zone of dropZones) {
          if (zone.filled) continue;
          const zoneEl = document.getElementById(zone.id);
          if (zoneEl) {
            const zoneRect = zoneEl.getBoundingClientRect();
            if (
              e.clientX >= zoneRect.left &&
              e.clientX <= zoneRect.right &&
              e.clientY >= zoneRect.top &&
              e.clientY <= zoneRect.bottom
            ) {
              handleDrop(dragging, zone.id);
              return;
            }
          }
        }
      }
      setDragging(null);
    },
    [dragging, dropZones, handleDrop]
  );

  // Check completion
  useEffect(() => {
    if (dragItems.length > 0 && dragItems.every((d) => d.placed)) {
      dispatch({ type: "COMPLETE_GAME" });
    }
  }, [dragItems]);

  useEffect(() => {
    if (state.phase === "complete" && state.startTime) {
      saveGameResult(state);
      confetti({ particleCount: 100, spread: 100, colors: ["#f83d82", "#45a668", "#f59e07", "#3b82f6"] });
    }
  }, [state.phase, state.startTime]);

  // Keyboard fallback
  useEffect(() => {
    if (!selectedItem || state.phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      const item = dragItems.find((d) => d.id === selectedItem);
      if (!item) return;
      if (e.key === "Enter") {
        // Find the matching zone
        const matchZone = dropZones.find((z) => z.romaji === item.romaji && !z.filled);
        if (matchZone) handleDrop(selectedItem, matchZone.id);
      }
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedItem, dragItems, dropZones, handleDrop, state.phase]);

  if (state.phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-kid-4 gap-kid-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">
          🎯
        </motion.div>
        <h1 className="text-heading-xl font-bold text-text text-center">Character Match</h1>
        <p className="text-body-lg text-text-muted text-center max-w-md">
          Drag the hiragana characters to their matching romaji zones. Or click a character, then click a zone!
        </p>
        <Button variant="primary" size="lg" onClick={startGame}>
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
        incorrectCount={state.incorrectCount}
        totalQuestions={state.totalQuestions}
        bestStreak={state.bestStreak}
        onPlayAgain={startGame}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto px-kid-4 py-kid-4 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Score bar */}
      <div className="flex items-center justify-between mb-kid-6 bg-surface rounded-kid-lg shadow-kid-card p-kid-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-heading-md font-bold text-accent-500">{state.score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span className="text-body-md font-semibold">{state.livesRemaining}</span>
        </div>
      </div>

      {/* Drop Zones */}
      <div className="mb-kid-8">
        <p className="text-body-sm font-semibold text-text-muted mb-kid-2 text-center">Drop characters here:</p>
        <div className="flex flex-wrap justify-center gap-kid-3">
          {dropZones.map((zone) => (
            <motion.button
              key={zone.id}
              id={zone.id}
              onClick={() => {
                if (selectedItem && !zone.filled) handleDrop(selectedItem, zone.id);
              }}
              className={`w-20 h-20 rounded-kid-lg border-3 flex items-center justify-center text-heading-md font-bold transition-all duration-200 cursor-pointer ${
                zone.filled
                  ? "bg-secondary-100 border-secondary-400 text-secondary-700"
                  : "bg-surface-raised border-dashed border-border hover:border-primary-300 hover:bg-primary-50"
              }`}
              whileHover={!zone.filled ? { scale: 1.05 } : undefined}
            >
              {zone.filled ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="font-japanese"
                >
                  {dragItems.find((d) => d.romaji === zone.romaji)?.character}
                </motion.span>
              ) : (
                <span className="text-text-muted">{zone.romaji}</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Draggable Items */}
      <div>
        <p className="text-body-sm font-semibold text-text-muted mb-kid-2 text-center">Drag these characters:</p>
        <div className="flex flex-wrap justify-center gap-kid-3">
          {dragItems.map((item) =>
            item.placed ? (
              <div key={item.id} className="w-16 h-16 opacity-20" />
            ) : (
              <motion.button
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                className={`w-16 h-16 bg-primary-50 border-3 rounded-kid-lg flex items-center justify-center font-japanese text-character-md text-primary-500 cursor-grab active:cursor-grabbing transition-shadow ${
                  selectedItem === item.id
                    ? "border-primary-500 shadow-kid-glow-pink scale-110"
                    : "border-primary-200 shadow-kid-card hover:shadow-kid-card-hover"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.character}
              </motion.button>
            )
          )}
        </div>
      </div>

      {/* Dragging overlay */}
      {dragging && (
        <div
          className="fixed pointer-events-none z-50 w-16 h-16 bg-primary-100 border-3 border-primary-500 rounded-kid-lg flex items-center justify-center font-japanese text-character-md text-primary-500 shadow-kid-glow-pink"
          style={{
            left: dragPos.x - dragOffset.current.x,
            top: dragPos.y - dragOffset.current.y,
          }}
        >
          {dragItems.find((d) => d.id === dragging)?.character}
        </div>
      )}
    </div>
  );
}
