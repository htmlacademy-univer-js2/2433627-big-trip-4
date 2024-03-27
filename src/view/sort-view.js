import AbstractView from '../framework/view/abstract-view.js';


function createSortTemplate() {
  return(
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input
        id="sort-day"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-day"
        data-name='day'
        checked
        >
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input
        id="sort-event"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-event"
        data-name='event'
        disabled
        >
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input
        id="sort-time"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-time"
        data-name='time'
        >
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input
        id="sort-price"
        class="trip-sort__input  visually-hidden"
        type="radio" name="trip-sort"
        value="sort-price"
        data-name='price'
        >
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input
        id="sort-offer"
        class="trip-sort__input  visually-hidden"
        type="radio" name="trip-sort"
        value="sort-offer"
        data-name='offer'
        disabled
        >
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortClick = null;

  constructor (onSortClick) {
    super();
    this.#onSortClick = onSortClick;

    this.element.querySelectorAll('.trip-sort__input')
      .forEach((item) => item.addEventListener('change', this.#changeSortType));
  }

  get template() {
    return createSortTemplate();
  }

  #changeSortType = (evt) => {
    evt.preventDefault();
    this.#onSortClick(evt.target.dataset.name);
  };
}
