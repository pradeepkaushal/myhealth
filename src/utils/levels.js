export const getLevelForStreak = (streak) => {
  if (streak >= 14) return "Platinum";
  if (streak >= 7) return "Gold";
  if (streak >= 3) return "Silver";
  return "Bronze";
};
