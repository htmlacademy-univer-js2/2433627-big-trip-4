import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../util.js';

export default class TripEventsPresenter {
  #listComponent = new ListView();

  #tpipEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #points = [];

  constructor({tpipEventsContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tpipEventsContainer = tpipEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(new SortView(), this.#tpipEventsContainer);
    render(this.#listComponent, this.#tpipEventsContainer);
    for (let i = 0; i < this.#points.length; i++) {
      const point = this.#points[i];
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const offer = this.#offersModel.getOfferByType(point.type);
      this.#renderPoint(point, destination, offer);
    }
  }

  #renderPoint = (point, destination, offer) => {
    const pointComponent = new PointView({
      point,
      city: destination.name,
      offer,
      onRollupButtonClick: pointRollupButtonClikHandler
    });

    const editPointComponent = new EditablePointView({
      point,
      destination,
      offer,
      onDeleteButtonClick: deleteButtonClikHandler,
      onSubmitForm: submitFormHandler,
      onRollupButtonClick: formRollupButtonClikHandler
    });

    function replacePointToForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    function onFormKeydown(evt) {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
      }
    }

    function pointRollupButtonClikHandler() {
      replacePointToForm();
      document.addEventListener('keydown', onFormKeydown);
    }

    function formRollupButtonClikHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeydown);
    }

    function submitFormHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeydown);
    }

    function deleteButtonClikHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeydown);
    }

    render(pointComponent, this.#listComponent.element);
  };
}
