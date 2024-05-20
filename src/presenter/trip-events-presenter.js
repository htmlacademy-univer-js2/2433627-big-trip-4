import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {render, remove} from '../framework/render.js';
import { UserAction, UpdateType, SortType, FilterType} from '../const.js';
import { calculateDateDifference, filter } from '../util.js';


export default class TripEventsPresenter {
  #listComponent = new ListView();
  #listEmptyComponent = null;
  #sortComponent = null;

  #tpipEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #currentSortType = SortType.PRICE;

  #pointPresenters = new Map();
  #newTaskPresenter = null;

  #filterType = null;

  constructor({tpipEventsContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewTaskDestroy}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newTaskPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTaskDestroy,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      case SortType.TIME:
        return filteredPoints.sort((a, b) =>
          calculateDateDifference(b.dateTo, b.dateFrom) - calculateDateDifference(a.dateTo, a.dateFrom));
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => a.basePrice - b.basePrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newTaskPresenter.init();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };

  #changeSortType = (type) => {
    this.#currentSortType = type;
    this.#clearBoard();
    this.#renderBoard();
  };

  #changeViewHandler = () => {
    this.#newTaskPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#changeSortType, this.#currentSortType);
    render(this.#sortComponent, this.#tpipEventsContainer);
  };

  #renderList = () => {
    render(this.#listComponent, this.#tpipEventsContainer);
  };

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#listEmptyComponent, this.#tpipEventsContainer);
  };

  #renderPoints = (points) => {
    this.#clearListEmptyText();

    if (points.length === 0) {
      this.#renderListEmpty(this.#filterType);
      return;
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const pointPresenter = new TripPointPresenter(
        this.#listComponent.element,
        this.#changeViewHandler,
        this.#handleViewAction,
        this.#offersModel,
        this.#destinationsModel
      );
      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    }
  };

  #renderBoard() {
    this.#renderSort();
    this.#renderList();
    this.#renderPoints(this.points);
  }

  #clearBoard(resetSortType = false) {
    this.#newTaskPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.remove());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#listEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearListEmptyText() {
    if (this.#listEmptyComponent !== null) {
      remove(this.#listEmptyComponent);
    }
  }
}
