import dayjs from 'dayjs';
import { FilterType } from './const';

function formatEventDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function formatEventDuration(diff) {
  const days = Math.floor(diff / 1440);
  const hours = Math.floor((diff % 1440) / 60);
  const minutes = diff % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
}

function calculateDateDifference(start, end) {
  start = dayjs(start);
  end = dayjs(end);

  return end.diff(start, 'minute');
}

const isElementHas = (element) => element !== null && element !== undefined && element.length > 0;

const isEscapeKey = (evt) => evt.key === 'Escape';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(point.dateTo, 'D')),
  [FilterType.FUTUTRE]: (points) => points.filter((point) => dayjs().isBefore(point.dateFrom, 'D')),
  [FilterType.PRESENT]: (points) => points.filter((point) => !dayjs().isAfter(point.dateTo, 'D') && !dayjs().isBefore(point.dateFrom, 'D'))
};

export {
  formatEventDate,
  isElementHas,
  isEscapeKey,
  calculateDateDifference,
  formatEventDuration,
  filter
};
