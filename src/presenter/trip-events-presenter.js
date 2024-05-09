import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import FilterView from '../view/filter-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import {render} from '../framework/render.js';
import {LIST_EMPTY_TEXT} from '../const.js';
import { calculateDateDifference, updateItem } from '../util.js';


export default class TripEventsPresenter {
  #listComponent = new ListView();
  #listEmptyComponent = null;

  #tpipEventsContainer = null;
  #tripFiltersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #pointPresenters = new Map();

  #points = [];

  #filterType = 'everything';

  constructor({tpipEventsContainer, tripFiltersContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#tripFiltersContainer = tripFiltersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderFilter();

    if (this.#points.length === 0) {
      this.#renderListEmpty('everything');
    }

    else {
      this.#renderSort();
      this.#renderList();
      this.#renderPoints(this.#points);
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #changeSortType = (type) => {
    this.#clearPoints();
    switch (type) {
      case 'day':
        this.#points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        this.#renderPoints(this.#points);
        break;
      case 'time':
        this.#points.sort((a, b) =>
          calculateDateDifference(b.dateTo, b.dateFrom) - calculateDateDifference(a.dateTo, a.dateFrom));
        this.#renderPoints(this.#points);
        break;
      case 'price':
        this.#points.sort((a, b) => a.basePrice - b.basePrice);
        this.#renderPoints(this.#points);
        break;
    }
  };

  #changeFilterType = (type) => {
    this.#filterType = type;
  };

  #changeViewHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(new SortView(this.#changeSortType), this.#tpipEventsContainer);
  };

  #renderFilter = () => {
    render(new FilterView(this.#changeFilterType), this.#tripFiltersContainer);
  };

  #renderList = () => {
    render(this.#listComponent, this.#tpipEventsContainer);
  };

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(LIST_EMPTY_TEXT[this.#filterType]);
    render(this.#listEmptyComponent, this.#tpipEventsContainer);
  };

  #renderPoints = (points) => {
    this.#clearListEmptyText();

    if (points.length === 0) {
      this.#renderListEmpty('everything');
      return;
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const pointPresenter = new TripPointPresenter(this.#listComponent.element, this.#changeViewHandler, this.#handlePointChange, this.#offersModel, this.#destinationsModel);
      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    }
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.remove());
    this.#pointPresenters.clear();
  };

  #clearListEmptyText = () => {
    if (this.#listEmptyComponent !== null) {
      this.#listEmptyComponent.remove();
    }
  };
}
