import { createId, getRandomInteger, getRandomArrayElement } from '../util.js';
import { MAX_PRICE, MIN_PRICE } from '../const.js';

const isFavoriteValues = [true, false];

const getPointId = createId();

function createPoint(type, offersId, destinationId) {
  return {
    id: getPointId(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: destinationId,
    isFavorite: getRandomArrayElement(isFavoriteValues),
    offers: offersId,
    type
  };
}

export {createPoint};
