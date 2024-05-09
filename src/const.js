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

const LIST_EMPTY_TEXT = {
  'everything' : 'Click New Event to create your first point',
  'past' : 'There are no past events now',
  'present' : 'There are no present events now',
  'future' : 'There are no future events now'
};

const MIN_PRICE = 100;
const MAX_PRICE = 5000;

export {POINT_TYPE, CITIES, DESCRIPTIONS, MAX_PRICE, MIN_PRICE, LIST_EMPTY_TEXT};
