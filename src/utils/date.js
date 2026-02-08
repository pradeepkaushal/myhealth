const pad2 = (value) => (value < 10 ? `0${value}` : `${value}`);

export const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
};

export const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const dayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const formatFriendlyDate = (key) => {
  if (!key) return "—";
  const [year, month, day] = key.split("-").map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
