import { CITIES, DESCRIPTIONS } from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../util.js';

const MAX_INT = 1000;
const MIN_INT = 10;

// const createDestinationId = createId();

const destinations = [
  {
    id: 'dest1',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
        description: 'city description'
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
        description: 'city description'
      }]
  },
  {
    id: 'dest2',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
        description: 'city description'
      }]
  },
  {
    id: 'dest3',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
        description: 'city description'
      }]
  }
];

export {destinations};

// function createDestinations() {
//   return {
//     id: createDestinationId(),
//     description: getRandomArrayElement(DESCRIPTIONS),
//     name: getRandomArrayElement(CITIES),
//     pictures: [
//       {
//         src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
//         description: getRandomArrayElement(DESCRIPTIONS)
//       }]
//   };
// }

