import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

export function getCalendarMatrix(year, month) {
  // dayjs의 month는 0-indexed, JS와 동일
  const firstDay = dayjs(new Date(year, month)).startOf('month');
  const lastDay = dayjs(new Date(year, month)).endOf('month');

  // 해당 월 시작 주의 일요일
  const start = firstDay.weekday(0);
  // 해당 월 끝 주의 토요일
  const end = lastDay.weekday(6);

  const matrix = [];
  let current = start;

  while (current.isSameOrBefore(end)) {
    matrix.push({
      date: current.toDate(),
      inMonth: current.month() === month,
    });
    current = current.add(1, 'day');
  }

  return matrix;
}
