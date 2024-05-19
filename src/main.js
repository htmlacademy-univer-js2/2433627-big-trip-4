import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';

const mainContainer = document.querySelector('.trip-main');
const tripControlsFilters = mainContainer.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const tripEventsPresenter = new TripEventsPresenter({
  tpipEventsContainer : tripEvents,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewTaskDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripEventsPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, mainContainer);
filterPresenter.init();
tripEventsPresenter.init();

