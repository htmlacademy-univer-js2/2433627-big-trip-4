import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../util.js';

export default class TripPointPresenter {
  #pointContainer = null;
  #onFavoriteChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #point = null;

  constructor(pointContainer, onFavoriteChange) {
    this.#pointContainer = pointContainer;
    this.#onFavoriteChange = onFavoriteChange;
  }

  init(point, destination, offer) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView({
      point,
      city: destination.name,
      offer,
      onRollupButtonClick: this.#pointRollupButtonClikHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler
    });

    this.#editPointComponent = new EditablePointView({
      point,
      destination,
      offer,
      onDeleteButtonClick: this.#deleteButtonClikHandler,
      onSubmitForm: this.#submitFormHandler,
      onRollupButtonClick: this.#formRollupButtonClikHandler
    });

    if (prevPointComponent !== null && this.#pointContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    else {
      render(this.#pointComponent, this.#pointContainer);
    }
  }

  #favoriteButtonClickHandler = () => {
    this.#onFavoriteChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

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
