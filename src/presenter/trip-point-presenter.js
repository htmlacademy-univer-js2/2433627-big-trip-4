import EditablePointView from '../view/editable-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../util.js';
import { UserAction, UpdateType } from '../const.js';


const View = {
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
  #offer = null;
  #destination = null;

  #view = View.DEFAULT;

  constructor(pointContainer, onViewChange, onDataChange, offersModel, destinationsModel) {
    this.#pointContainer = pointContainer;
    this.#onViewChange = onViewChange;
    this.#onDataChange = onDataChange;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#destinationsModel.getDestinationById(this.#point.destination);
    this.#offer = this.#offersModel.getOfferByType(this.#point.type);

    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView({
      point,
      city: this.#destination.name,
      offer: this.#offer,
      onRollupButtonClick: this.#pointRollupButtonClikHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler
    });

    this.#editPointComponent = new EditablePointView({
      point,
      destination: this.#destination,
      offer: this.#offer,
      onDeleteButtonClick: this.#deleteButtonClikHandler,
      onSubmitForm: this.#submitFormHandler,
      onRollupButtonClick: this.#formRollupButtonClikHandler,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });

    if (prevPointComponent !== null && this.#pointContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    else {
      render(this.#pointComponent, this.#pointContainer);
    }
  }

  resetView() {
    if (this.#view === View.EDIT){
      this.#editPointComponent.reset(this.#point, this.#destination, this.#offer);
      this.#replaceFormToPoint();
    }
  }

  remove() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  setSaving() {
    if (this.#view === View.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#view === View.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#view === View.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #replacePointToForm() {
    this.#onViewChange();
    replace(this.#editPointComponent, this.#pointComponent);
    this.#view = View.EDIT;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#view = View.DEFAULT;
  }

  #pointRollupButtonClikHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onFormKeydown);
  };

  #formRollupButtonClikHandler = () => {
    this.#editPointComponent.reset(this.#point, this.#destination, this.#offer);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #submitFormHandler = (point) => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #deleteButtonClikHandler = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeydown);
  };

  #onFormKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point, this.#destination, this.#offer);
      this.#replaceFormToPoint();
    }
  };

  #favoriteButtonClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };
}
