const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Amsterdam', 'Geneva', 'Chamonix', 'Moscow', 'Paris'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
];

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTUTRE: 'future'
};

const LIST_EMPTY_TEXT = {
  [FilterType.EVERYTHING] : 'Click New Event to create your first point',
  [FilterType.PAST] : 'There are no past events now',
  [FilterType.PRESENT] : 'There are no present events now',
  [FilterType.FUTUTRE] : 'There are no future events now'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const MIN_PRICE = 100;
const MAX_PRICE = 5000;

export {
  POINT_TYPE,
  CITIES,
  DESCRIPTIONS,
  MAX_PRICE,
  MIN_PRICE,
  LIST_EMPTY_TEXT,
  UserAction,
  UpdateType,
  FilterType,
  SortType
};
