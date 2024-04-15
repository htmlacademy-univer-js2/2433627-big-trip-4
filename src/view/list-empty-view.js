import AbstractView from '../framework/view/abstract-view.js';

function createListEmptyTemplate(text) {
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #text = null;

  constructor(text) {
    super();
    this.#text = text;
  }

  get template() {
    return createListEmptyTemplate(this.#text);
  }
}
