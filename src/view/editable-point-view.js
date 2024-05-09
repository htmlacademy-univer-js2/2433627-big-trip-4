import { POINT_TYPE, CITIES } from '../const.js';
import { formatEventDate, isElementHas } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

function createEditablePointTemplate(state) {
  const type = state.type;
  return(
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeList(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${state.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationsList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatEventDate(state.point.dateFrom, DATE_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatEventDate(state.point.dateTo, DATE_FORMAT)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${state.point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${state.isOffers ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createOffersList(state.offer, state.point.offers)}` : ''}
          </div>
        </section>

        ${state.isDestination ||
          state.isPictures ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>` : ''}

            ${state.isDestination ? `<p class="event__destination-description">${state.destination?.description}</p>` : ''}
            ${state.isPictures ? `<div class="event__photos-container">
              <div class="event__photos-tape">${createDestinationPhotosList(state.destination?.pictures)}</div>` : ''}
        </section>
      </section>
    </form>
  </li>`
  );
}

function createDestinationPhotosList(pictures) {
  const photosList = pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt=${picture.description}>`);
  return photosList.join('');
}

function createEventTypeList(type) {
  const eventTypeList = POINT_TYPE.map((pointType) => `<div class="event__type-item">
    <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
    <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType[0].toUpperCase() + pointType.slice(1)} ${pointType === type ? 'checked' : ''}</label>
    </div>`);
  return eventTypeList.join('');
}

function createDestinationsList() {
  const destinationsList = CITIES.map((city) => `<option value=${city}></option>`);
  return destinationsList.join('');
}

function createOffersList(offer, pointOffers) {
  const offerList = offer.offers.map((offerItem) => {
    const offerName = offerItem.title.replace(' ', '').toLowerCase();
    const isCheked = pointOffers.find((id) => id === offerItem.id) !== undefined;

    return `<div class="event__offewar-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-1" type="checkbox" name="event-offer-${offerName}" ${isCheked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offerName}-1">
    <span class="event__offer-title">${offerItem.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offerItem.price}</span>
    </label>
    </div>`;
  });
  return offerList.join('');
}

export default class EditablePointView extends AbstractStatefulView {
  #point = null;
  #destination = null;
  #offer = null;
  #onSubmitForm = null;
  #onDeleteButtonClick = null;
  #onRollupButtonClick = null;
  #getOfferByType = null;
  #getDestinationByName = null;


  constructor ({point, destination, offer, onDeleteButtonClick, onSubmitForm, onRollupButtonClick, getDestinationByName, getOfferByType}){
    super();
    this._setState(EditablePointView.parsePointToState(point, destination, offer));
    this.#onDeleteButtonClick = onDeleteButtonClick;
    this.#onSubmitForm = onSubmitForm;
    this.#onRollupButtonClick = onRollupButtonClick;
    this.#getDestinationByName = getDestinationByName;
    this.#getOfferByType = getOfferByType;

    this._restoreHandlers();
  }

  get template() {
    return createEditablePointTemplate(this._state);
  }

  reset(point, destination, offer) {
    this.updateElement(
      EditablePointView.parsePointToState(point, destination, offer)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#submitFormHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteButtonClickHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);

    this.element.querySelectorAll('.event__type-input').
      forEach((input) => input.addEventListener('click', this.#typeInputHandler));
    this.element.querySelector('.event__input--destination').
      addEventListener('change', this.#destinationInputHandler);
  }

  static parsePointToState(point, destination, offer) {
    return{
      point,
      offer,
      destination,
      type: point.type,
      name: destination.name,
      isOffers: isElementHas(offer.offers),
      isDestination: isElementHas(destination.description),
      isPictures: isElementHas(destination.pictures),
    };
  }

  static parseStateToPoint(state) {
    const point = state.point;

    return point;
  }

  static parseStateToOffer(state) {
    const offer = state.offer;

    return offer;
  }

  static parseStateToDestination(state) {
    const destination = state.destination;

    return destination;
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteButtonClick();
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitForm(EditablePointView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupButtonClick();
  };

  #typeInputHandler = (evt) => {
    evt.preventDefault();
    const newOffers = this.#getOfferByType(evt.target.value);
    this.updateElement({
      offer: newOffers,
      isOffers: isElementHas(newOffers.offers),
      type: newOffers.type
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#getDestinationByName(evt.target.value);
    this.updateElement({
      destination: newDestination,
      name: evt.target.value,
      isDestination: isElementHas(newDestination?.description),
      isPictures: isElementHas(newDestination?.pictures),
    });
  };
}
