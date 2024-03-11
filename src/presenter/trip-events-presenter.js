import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render } from '../framework/render.js';

export default class TripEventsPresenter {
  #listComponent = new ListView();
  #tpipEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  // #offers = [];
  // #destinations = [];

  constructor({tpipEventsContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    // this.#offers = [...this.#offersModel.offers];
    // this.#destinations = [...this.#destinationsModel.destinations];

    render(new SortView(), this.#tpipEventsContainer);
    render(this.#listComponent, this.#tpipEventsContainer);
    const of = this.#offersModel.getOfferByType(this.#points[0].type);
    render(new EditablePointView(this.#points[0],
      this.#destinationsModel.getDestinationById(this.#points[0].destination),
      of), this.#listComponent.element);

    for (let i = 0; i < this.#points.length; i++) {
      const point = this.#points[i];
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const offer = this.#offersModel.getOfferByType(point.type);
      render(new PointView({point, city: destination.name, offer}), this.#listComponent.element);
    }
  }
}
