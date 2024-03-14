import dayjs from 'dayjs';

function formatEventDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function createId() {
  let lastGeneratedId = 0;
  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

function getRandomInteger(a, b) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

const isElementHas = (element) => element.length > 0;

const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

export {createId, getRandomInteger, getRandomArrayElement, formatEventDate, isElementHas, isEscapeKey};
