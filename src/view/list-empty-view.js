import AbstractView from '../framework/view/abstract-view.js';
import { ListEmptyText } from '../const.js';

function createListEmptyTemplate(filterType) {
  const text = ListEmptyText[filterType];
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
