import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../util.js';


const VIEW = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT'
};

export default class TripPointPresenter {
  #pointContainer = null;
  #onViewChange = null;
  #onDataChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #offersModel = null;
  #destinationsModel = null;

  #point = null;

  #view = VIEW.DEFAULT;

  constructor(pointContainer, onViewChange, onDataChange, offersModel, destinationsModel) {
    this.#pointContainer = pointContainer;
    this.#onViewChange = onViewChange;
    this.#onDataChange = onDataChange;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;

    const destination = this.#destinationsModel.getDestinationById(this.#point.destination);
    const offer = this.#offersModel.getOfferByType(this.#point.type);

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
      onRollupButtonClick: this.#formRollupButtonClikHandler,
      getDestinationByName: this.#getDestinationByName,
      getOfferByType : this.#getOfferByType
    });

    if (prevPointComponent !== null && this.#pointContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    else {
      render(this.#pointComponent, this.#pointContainer);
    }
  }

  #favoriteButtonClickHandler = () => {
    this.#onDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
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

  remove = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #pointRollupButtonClikHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onFormKeydown);
  };

  #formRollupButtonClikHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #submitFormHandler = (point) => {
    this.#onDataChange(point);
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

  #getOfferByType = (type) => this.#offersModel.getOfferByType(type);

  #getDestinationByName = (name) => this.#destinationsModel.getDestinationByName(name);
}
