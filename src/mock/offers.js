import { MAX_PRICE, MIN_PRICE } from '../const.js';
import { getRandomInteger } from '../util.js';

// const createOfferId = createId();

const offers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 'of1',
        title: 'Upgrade',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE)
      }]
  },
  {
    type: 'bus',
    offers: []
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'of2',
        title: 'Baggage',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE)
      },
      {
        id: 'of3',
        title: 'First Class',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE)
      }]
  }
];

export {offers};

// function createDestinations() {
//   return {
//     type: getRandomArrayElement(POINT_TYPE),
//     offers: [
//       {
//         id: createOfferId(),
//         title: 'Upgrade',
//         price: getRandomInteger(MIN_PRICE, MAX_PRICE)
//       }]
//   };
// }

