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
