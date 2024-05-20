import { destinations } from '../mock/destination.js';

export default class DestinationsModel {
  #destinations = destinations;

  get destinations(){
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getDestinationByName(name) {
    return this.destinations.find((destination) => destination.name === name);
  }
}
