import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import LoadingView from '../view/loading-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import TripInfoView from '../view/trip-info-view.js';

import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import {render, remove, RenderPosition} from '../framework/render.js';
import { UserAction, UpdateType, SortType, FilterType} from '../const.js';
import { calculateDateDifference, filter } from '../util.js';


export default class TripEventsPresenter {
  #listComponent = new ListView();
  #listEmptyComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #tripInfoComponent = null;

  #tpipEventsContainer = null;
  #mainContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #currentSortType = SortType.PRICE;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #filterType = null;
  #isLoading = true;

  constructor({tpipEventsContainer, mainContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
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
    this.#newPointPresenter.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#changeSortType, this.#currentSortType);
    render(this.#sortComponent, this.#tpipEventsContainer);
  };

  #renderList = () => {
    render(this.#listComponent, this.#tpipEventsContainer);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#tpipEventsContainer);
  }

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#listEmptyComponent, this.#tpipEventsContainer);
    remove(this.#loadingComponent);
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

  #renderTripInfo = () => {
    this.#tripInfoComponent = new TripInfoView(this.#pointsModel, this.#destinationsModel, this.#offersModel);
    render(this.#tripInfoComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderList();
    this.#renderPoints(this.points);
  }

  #clearBoard(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.remove());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#listEmptyComponent);
    remove(this.#tripInfoComponent);

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
