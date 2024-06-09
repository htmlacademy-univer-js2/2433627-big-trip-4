import AbstractView from '../framework/view/abstract-view.js';
import { formatEventDate } from '../util.js';

const DATE_FORMAT = 'MMM D';

function createTripInfoTemplate(pointsModel, destinationsModel, offersModel) {
  const points = pointsModel.points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

  return(
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getDestinationsList(points, destinationsModel)}</h1>

        <p class="trip-info__dates">${getDates(points)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getCost(points, offersModel)}</span>
      </p>
    </section>`
  );
}

function getDestinationsList(points, destinationsModel) {
  const destinations = [];
  let prevDestination = null;

  points.forEach((point) => {
    const destination = destinationsModel.getDestinationById(point.destination).name;
    if (prevDestination !== destination) {
      destinations.push(destination);
    }
    prevDestination = destination;
  });

  const destinationsCount = destinations.length;
  const firstDestination = destinations[0];
  const lastDestination = destinations[destinationsCount - 1];

  if (destinationsCount <= 3) {
    return `${firstDestination} — ${destinations.slice(1, -1).join(' — ')} — ${lastDestination}`;
  } else {
    return `${firstDestination} —...— ${lastDestination}`;
  }
}

function getDates(points) {
  const pointsCount = points.length;
  const firstPoint = points[0];
  const lastPoint = points[pointsCount - 1];

  return `${formatEventDate(firstPoint.dateFrom, DATE_FORMAT)}&nbsp;&mdash;&nbsp;${formatEventDate(lastPoint.dateTo, DATE_FORMAT)}`;
}

function getCost(points, offersModel) {
  let pointsBasePrice = 0;
  let pointsOffersPrice = 0;

  points.forEach((point) => {
    pointsBasePrice += point.basePrice;

    const offerItem = offersModel.getOfferByType(point.type);

    point.offers.forEach((offerId) => {
      const offerById = offerItem.offers.find((offer) =>offer.id === offerId);
      pointsOffersPrice += offerById.price;
    });

  });

  return pointsBasePrice + pointsOffersPrice;
}

export default class TripInfoView extends AbstractView {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor(pointsModel, destinationsModel, offersModel) {
    super();
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get template() {
    return createTripInfoTemplate(this.#pointsModel, this.#destinationsModel, this.#offersModel);
  }
}
