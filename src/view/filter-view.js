import AbstractView from '../framework/view/abstract-view.js';

function createFilterItem(filter, currentFilter) {
  const {type, count} = filter;
  return(
    `<div class="trip-filters__filter">
      <input
      id="filter-${type}"
      class="trip-filters__filter-input
      visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${currentFilter === type ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}" data-name='${type}'>${type}</label>
    </div>`
  );
}

function createFilterTemplate(filters, currentFilter) {
  const filterList = filters.map((filter) => (
    createFilterItem(filter, currentFilter))
  ).join('');

  return(
    `<form class="trip-filters" action="#" method="get">
      ${filterList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterClick = null;

  constructor(filters, currentFilter, onFilterTypeChange) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterClick = onFilterTypeChange;

    this.element.addEventListener('change', this.#changeFilterTypeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #changeFilterTypeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterClick(evt.target.value);
  };
}
