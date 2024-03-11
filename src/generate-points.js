import { createPoint } from './mock/p.js';
import { createOffer } from './mock/o.js';
import { createDestination } from './mock/d.js';
import { POINT_TYPE } from './const';
import { getRandomArrayElement } from './util.js';

function generatePoint() {
  const pointType = getRandomArrayElement(POINT_TYPE);
  const offer = createOffer(pointType);
  const destination = createDestination();
  const offersId = Array.from(offer.offers, (x) => x.id);
  const point = createPoint(pointType, offersId, destination.id);
  const pointInformation = {point, offer, destination};
  return pointInformation;
}

export {generatePoint};
