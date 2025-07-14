import dayjs from 'dayjs';

export function generateCalendarDates(centerDate, mode) {
  const base = dayjs(centerDate);

  if (mode === 'MONTH') {
    const start = base.startOf('month').startOf('week'); // 해당 월의 첫 주 시작
    return Array.from({ length: 6 * 7 }, (_, i) => start.add(i, 'day')); // 6주 * 7일
  }

  if (mode === 'WEEK') {
    const start = base.startOf('week'); // 해당 주 시작 (일요일부터)
    return Array.from({ length: 7 }, (_, i) => start.add(i, 'day')); // 7일
  }

  return []; // fallback
}
