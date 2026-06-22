export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function weekStartDate() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

export function rollingLast7Days() {
  const days: string[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

export function dayLabel(isoDate: string) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(new Date(isoDate));
}
