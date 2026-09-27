export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

// Monday of the current ISO week, as YYYY-MM-DD
export function currentWeekStartISO(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

export const WEEKDAY_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

export function weeksAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n * 7);
  return toISODate(d);
}

// Current streak of consecutive days (ending today or yesterday) present in doneDates.
export function computeStreak(doneDates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  // if today isn't done yet, streak can still count from yesterday backwards
  if (!doneDates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (doneDates.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
