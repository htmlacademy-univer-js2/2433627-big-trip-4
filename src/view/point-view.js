import AbstractView from '../framework/view/abstract-view.js';
import { formatEventDate, isElementHas } from '../util.js';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

function createPointTemplate(point, city, offer) {
  return(
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${point.dateFrom}">${formatEventDate(point.dateFrom, DATE_FORMAT)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.dateFrom}">${formatEventDate(point.dateFrom, TIME_FORMAT)}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.dateTo}">${formatEventDate(point.dateTo, TIME_FORMAT)}</time>
          </p>
          <p class="event__duration"></p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        ${isElementHas(offer.offers) ? `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${createOffersTemplate(offer)}
        </ul>` : ''}
        <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

function createOffersTemplate(offer) {
  const offersList = offer.offers.map((offerItem) => `<li class="event__offer">
       <span class="event__offer-title">${offerItem.title}</span>
       &plus;&euro;&nbsp;
       <span class="event__offer-price">${offerItem.price}</span>
       </li>`);
  return offersList.join('');
}

export default class PointView extends AbstractView{
  #point = null;
  #city = null;
  #offer = null;
  #onRollupButtonClick = null;
  #onFavoriteButtonClick = null;

  constructor({point, city, offer, onRollupButtonClick, onFavoriteButtonClick}){
    super();
    this.#point = point;
    this.#city = city;
    this.#offer = offer;
    this.#onRollupButtonClick = onRollupButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#city, this.#offer);
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteButtonClick();
  };
}
