import { addDays, getLocalDateKey } from "./date";

export const getLastNDays = (count) => {
  const days = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = addDays(today, -i);
    days.push({
      key: getLocalDateKey(date),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return days;
};

export const sumMinutesForDay = (entries, dayKey) => {
  if (!entries || !entries.length) return 0;
  return entries
    .filter((entry) => entry.date === dayKey)
    .reduce((total, entry) => total + entry.minutes, 0);
};

export const sumTotalMinutes = (entries) => {
  if (!entries || !entries.length) return 0;
  return entries.reduce((total, entry) => total + (entry.minutes || 0), 0);
};

export const calculatePointsFromMinutes = (minutes, streak = 0) => {
  const safeMinutes = Number(minutes) || 0;
  const safeStreak = Number(streak) || 0;
  return Math.max(0, Math.round(safeMinutes * 4 + safeStreak * 10));
};

export const calculatePoints = (entries, streak = 0) =>
  calculatePointsFromMinutes(sumTotalMinutes(entries), streak);
