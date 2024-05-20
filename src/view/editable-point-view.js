import { POINT_TYPE, CITIES } from '../const.js';
import { formatEventDate, isElementHas } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const newPoint = {
  id: 11111,
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createEditablePointTemplate(state, isNew) {
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${state.name === undefined ? '' : `value="${state.name}"`} list="destination-list-1" autocomplete="off">
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${state.point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>

        ${isNew ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
          </button>`}
      </header>
      <section class="event__details">
        ${state.isOffers ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createOffersList(state.offer, state.checkedOffers)}` : ''}
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
  const destinationsList = CITIES.map((city) => `<option value=${city}>${city}</option>`);
  return destinationsList.join('');
}

function createOffersList(offer, checkedOffers) {
  const offerList = offer.offers.map((offerItem) => {
    const offerName = offerItem.title.replace(' ', '').toLowerCase();
    const isCheked = checkedOffers.find((id) => id === offerItem.id) !== undefined;

    return `<div class="event__offewar-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-1" type="checkbox" name="event-offer-${offerName}" data-id = '${offerItem.id}' ${isCheked ? 'checked' : ''}>
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
  #onSubmitForm = null;
  #onDeleteButtonClick = null;
  #onRollupButtonClick = null;
  #offersModel = null;
  #destinationsModel = null;

  #fromDatepicker = null;
  #toDatepicker = null;

  #isNew = null;

  constructor ({point = newPoint, destination = null, offer = null, onDeleteButtonClick, onSubmitForm, onRollupButtonClick = null, destinationsModel, offersModel, isNew = false}){
    super();
    this._setState(EditablePointView.parsePointToState(point, destination, offer));
    this.#onDeleteButtonClick = onDeleteButtonClick;
    this.#onSubmitForm = onSubmitForm;
    this.#onRollupButtonClick = onRollupButtonClick;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#isNew = isNew;

    this._restoreHandlers();
  }

  get template() {
    return createEditablePointTemplate(this._state, this.#isNew);
  }

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  reset(point, destination, offer) {
    this.updateElement(
      EditablePointView.parsePointToState(point, destination, offer)
    );
  }

  _restoreHandlers() {
    this.element?.querySelector('.event--edit')
      ?.addEventListener('submit', this.#submitFormHandler);

    this.element.querySelector('.event__reset-btn')
      ?.addEventListener('click', this.#deleteButtonClickHandler);

    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#rollupButtonClickHandler);

    this.element.querySelectorAll('.event__type-input')
      ?.forEach((input) => input.addEventListener('click', this.#typeInputHandler));

    this.element.querySelector('.event__input--destination')
      ?.addEventListener('change', this.#destinationInputHandler);

    this.element.querySelectorAll('.event__offer-checkbox')
      ?.forEach((checkbox) => checkbox.addEventListener('change', this.#offerInputHandler));

    this.#setDatepicker();
  }

  static parsePointToState(point, destination, offer) {
    return{
      point,
      offer,
      destination,
      type: point.type,
      name: destination?.name,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      checkedOffers: point.offers,
      isOffers: isElementHas(offer?.offers),
      isDestination: isElementHas(destination?.description),
      isPictures: isElementHas(destination?.pictures),
    };
  }

  static parseStateToPoint(state) {
    const point = state.point;
    point.destination = state.destination.id;
    point.type = state.type;
    point.offers = state.checkedOffers;

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
    this.#onDeleteButtonClick(EditablePointView.parseStateToPoint(this._state));
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
    const newOffers = this.#offersModel.getOfferByType(evt.target.value);
    this.updateElement({
      offer: newOffers,
      isOffers: isElementHas(newOffers.offers),
      type: newOffers.type
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#destinationsModel.getDestinationByName(evt.target.value);
    if (newDestination === undefined) {return;}

    this.updateElement({
      destination: newDestination,
      name: evt.target.value,
      isDestination: isElementHas(newDestination?.description),
      isPictures: isElementHas(newDestination?.pictures),
    });
  };

  #offerInputHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.id;
    let checkedOffers = this._state.checkedOffers;
    const isChecked = evt.target.checked;
    if (isChecked) {
      checkedOffers.push(offerId);
    } else {
      checkedOffers = checkedOffers.filter((item) => item !== offerId);
    }

    this.updateElement({
      checkedOffers: checkedOffers
    });
  };

  #dateFromChangeHandler = (userDate) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = (userDate) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: new Date(this._state.dateFrom),
        onChange: this.#dateFromChangeHandler
      },
    );

    this.#toDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: new Date(this._state.dateTo),
        onChange: this.#dateToChangeHandler
      },
    );
  }
}

