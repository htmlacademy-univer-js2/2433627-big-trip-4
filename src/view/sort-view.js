import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortItemTemplate(type, currentSortType) {
  return(
    `<div class="trip-sort__item  trip-sort__item--${type}">
      <input
      id="sort-${type}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${type}"
      data-name='${type}'
      ${currentSortType === type ? 'checked' : ''}
      ${type === 'event' || type === 'offers' ? 'disabled' : ''}
      >
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`
  );
}

function createSortTemplate(currentSortType) {
  const sortList = Object.values(SortType).map((type) => (
    createSortItemTemplate(type, currentSortType))
  ).join('');

  return(
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortList}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortClick = null;
  #currentSortType = null;

  constructor (onSortClick, currentSortType) {
    super();
    this.#onSortClick = onSortClick;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#changeSortTypeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #changeSortTypeHandler = (evt) => {
    evt.preventDefault();
    this.#onSortClick(evt.target.dataset.name);
  };
}
