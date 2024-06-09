const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTUTRE: 'future'
};

const ListEmptyText = {
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

export {
  POINT_TYPES,
  ListEmptyText,
  UserAction,
  UpdateType,
  FilterType,
  SortType
};
