import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../util.js';

export default class TripPointPresenter {
  #pointContainer = null;

  #pointComponent = null;
  #editPointComponent = null;

  constructor(pointContainer) {
    this.#pointContainer = pointContainer;
  }

  init(point, destination, offer) {
    this.#pointComponent = new PointView({
      point,
      city: destination.name,
      offer,
      onRollupButtonClick: this.#pointRollupButtonClikHandler
    });

    this.#editPointComponent = new EditablePointView({
      point,
      destination,
      offer,
      onDeleteButtonClick: this.#deleteButtonClikHandler,
      onSubmitForm: this.#submitFormHandler,
      onRollupButtonClick: this.#formRollupButtonClikHandler
    });

    render(this.#pointComponent, this.#pointContainer);
  }

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
  }

  #pointRollupButtonClikHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onFormKeydown);
  };

  #formRollupButtonClikHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #submitFormHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #deleteButtonClikHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #onFormKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
