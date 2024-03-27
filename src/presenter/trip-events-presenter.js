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

  #pointPresenters = new Map();

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
    this.#renderPoints(this.#points);
  }

  #changePointFavorite = (point) => {
    this.#points = this.#points.map((element) => element.id === point.id ? point : element);

    const destination = this.#destinationsModel.getDestinationById(point.destination);
    const offer = this.#offersModel.getOfferByType(point.type);
    this.#pointPresenters.get(point.id).init(point, destination, offer);
  };

  #changeSortType = (type) => {
    this.#clearPoints();
    switch (type) {
      case 'day':
        this.#points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        this.#renderPoints(this.#points);
        break;
      case 'time':
        // code block
        break;
      case 'price':
        this.#points.sort((a, b) => a.basePrice - b.basePrice);
        this.#renderPoints(this.#points);
        break;
    }
  };

  #changeViewHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(new SortView(this.#changeSortType), this.#tpipEventsContainer);
  };

  #renderList = () => {
    render(this.#listComponent, this.#tpipEventsContainer);
  };

  #renderPoints = (points) => {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const offer = this.#offersModel.getOfferByType(point.type);
      const pointPresenter = new TripPointPresenter(this.#listComponent.element, this.#changePointFavorite, this.#changeViewHandler);
      pointPresenter.init(point, destination, offer);
      this.#pointPresenters.set(point.id, pointPresenter);
    }
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.remove());
    this.#pointPresenters.clear();
  };
}
