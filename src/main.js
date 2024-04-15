import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const tripEventsPresenter = new TripEventsPresenter({tpipEventsContainer : tripEvents, tripFiltersContainer: tripControlsFilters, pointsModel, offersModel, destinationsModel});

tripEventsPresenter.init();

