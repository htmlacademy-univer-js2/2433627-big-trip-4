import dayjs from 'dayjs';

function formatEventDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function formatEventDuration(diff) {
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return hours === 0 ? `${minutes}M` : `${hours}H ${minutes}M`;
}

function createId() {
  let lastGeneratedId = 0;
  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function getRandomInteger(a, b) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function calculateDateDifference(start, end) {
  start = dayjs(start);
  end = dayjs(end);

  return end.diff(start, 'minute');
}

const isElementHas = (element) => element !== null && element !== undefined && element.length > 0;

const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

export {createId, getRandomInteger, getRandomArrayElement, formatEventDate, isElementHas, isEscapeKey, calculateDateDifference, formatEventDuration, updateItem};
