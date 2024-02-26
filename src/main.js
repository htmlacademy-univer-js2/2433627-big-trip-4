import { render } from './render.js';
import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';


const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter({tpipEventsContainer : tripEvents});

render(new FilterView(), tripControlsFilters);

tripEventsPresenter.init();

