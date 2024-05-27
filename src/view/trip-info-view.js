import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(pointsModel) {
  const points = pointsModel.points;

  return(
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>`
  );
}

function getDestinationsList(points, destinationsModel) {
  const destinations = [];
  if (points.length === 3 || points.length === 2) {
    destinations = points.map((point) => (
      destinationsModel.getDestinationById(point.destination))
    );
  } else
}

export default class TripInfoView extends AbstractView {
  #pointsModel = null;
  #destinationsModel = null;

  constructor(pointsModel, destinationsModel) {
    super();
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  get template() {
    return createTripInfoTemplate(this.#pointsModel, this.#destinationsModel);
  }
}
