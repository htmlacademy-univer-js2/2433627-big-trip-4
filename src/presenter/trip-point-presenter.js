import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../util.js';


const VIEW = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT'
};

export default class TripPointPresenter {
  #pointContainer = null;
  #onFavoriteChange = null;
  #onViewChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #point = null;

  #view = VIEW.DEFAULT;

  constructor(pointContainer, onFavoriteChange, onViewChange) {
    this.#pointContainer = pointContainer;
    this.#onFavoriteChange = onFavoriteChange;
    this.#onViewChange = onViewChange;
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
    this.#onViewChange();
    replace(this.#editPointComponent, this.#pointComponent);
    this.#view = VIEW.EDIT;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#view = VIEW.DEFAULT;
  }

  resetView = () => {
    if (this.#view === VIEW.EDIT){
      this.#replaceFormToPoint();
    }
  };

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
