import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';

import PointsApi from './api/points-api.js';
import OffersApi from './api/offers-api.js';
import DestinationsApi from './api/destinations-api.js';

const AUTHORIZATION = 'Basic h111222sfasfafsf44ffx';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const mainContainer = document.querySelector('.trip-main');
const tripControlsFilters = mainContainer.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApi: new PointsApi(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApi: new OffersApi(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsApi: new DestinationsApi(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsPresenter({
  tpipEventsContainer : tripEvents,
  mainContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

async function initPointsData() {
  await Promise.all([
    destinationsModel.init(),
    offersModel.init(),
  ]);
}

async function initModels() {
  await initPointsData();
  pointsModel.init();
}

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripEventsPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, mainContainer);

initModels();
filterPresenter.init();
tripEventsPresenter.init();
