import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import { render} from '../framework/render.js';


export default class TripEventsPresenter {
  #listComponent = new ListView();

  #tpipEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #points = [];

  constructor({tpipEventsContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderSort();
    this.#renderList();
    for (let i = 0; i < this.#points.length; i++) {
      const point = this.#points[i];
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const offer = this.#offersModel.getOfferByType(point.type);
      this.#renderPoint(point, destination, offer);
    }
  }

  #renderSort = () => {
    render(new SortView(), this.#tpipEventsContainer);
  };

  #renderList = () => {
    render(this.#listComponent, this.#tpipEventsContainer);
  };

  #renderPoint = (point, destination, offer) => {
    const pointPresenter = new TripPointPresenter(this.#listComponent.element);
    pointPresenter.init(point, destination, offer);
  };
}
