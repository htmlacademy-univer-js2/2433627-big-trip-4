import { getRandomInteger, createId } from '../util.js';
import { MAX_PRICE, MIN_PRICE } from '../const.js';

const MAX_OFFER_COUNT = 4;
const MIN_OFFER_COUNT = 0;

const createOfferId = createId();

function createOffer(type) {
  return {
    type,
    offers:
      Array.from({length: getRandomInteger(MIN_OFFER_COUNT, MAX_OFFER_COUNT)}, () => ({
        id: createOfferId(),
        title: 'Upgrade',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE)
      }))
  };
}

// function createArrayFromOffersId(offers) {
//   //const offer = offers.find((elem) => elem.type === type);
//   const arr = Array.from(offers, (x) => x.id);
//   return arr;
// }

// function createOffer() {
//   return {
//     id: createOfferId(),
//     title: 'Upgrade',
//     price: getRandomInteger(MIN_PRICE, MAX_PRICE)
//   };
// }

export {createOffer};
