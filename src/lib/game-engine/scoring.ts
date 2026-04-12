export function calculateScore(
  correct: boolean,
  streak: number,
  basePoints: number = 10
): number {
  if (!correct) return 0;
  const streakBonus = Math.floor(streak / 3) * 5;
  return basePoints + streakBonus;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getStarRating(accuracy: number): number {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}
