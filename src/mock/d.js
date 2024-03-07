import { CITIES, DESCRIPTIONS } from '../const.js';
import { getRandomArrayElement, getRandomInteger, createId } from '../util.js';

const MAX_INT = 1000;
const MIN_INT = 10;

const createDestinationId = createId();

function createDestination() {
  const city = getRandomArrayElement(CITIES);
  return {
    id: createDestinationId(),
    description: getRandomArrayElement(DESCRIPTIONS),
    name: city,
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_INT, MAX_INT)}`,
        description: city
      }]
  };
}

export {createDestination};
