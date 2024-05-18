import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
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
  filterModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filterModel,
  pointsModel
});

filterPresenter.init();
tripEventsPresenter.init();

