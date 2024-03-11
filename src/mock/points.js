import { createId, getRandomInteger, getRandomArrayElement } from '../util.js';
import { MAX_PRICE, MIN_PRICE } from '../const.js';

const isFavoriteValues = [true, false];

const getPointId = createId();

const points = [
  {
    id: getPointId(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: '2019-07-10T11:55:56',
    dateTo: '2019-07-11T12:22:13',
    destination: 'dest1',
    isFavorite: getRandomArrayElement(isFavoriteValues),
    offers: [
      'of1'
    ],
    type: 'taxi'
  },
  {
    id: getPointId(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: '2019-07-10T22:55:56',
    dateTo: '2019-07-11T11:22:13',
    destination: 'dest2',
    isFavorite: getRandomArrayElement(isFavoriteValues),
    offers: [],
    type: 'bus'
  },
  {
    id: getPointId(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: '2019-07-10T22:55:56',
    dateTo: '2019-07-11T11:22:13',
    destination: 'dest3',
    isFavorite: getRandomArrayElement(isFavoriteValues),
    offers: [
      'of2',
      'of3'
    ],
    type: 'flight'
  }
];

export {points};
