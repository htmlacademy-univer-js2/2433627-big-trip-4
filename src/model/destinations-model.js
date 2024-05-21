export default class DestinationsModel {
  #destinations = [];
  #destinationsApi = null;

  constructor({destinationsApi}) {
    this.#destinationsApi = destinationsApi;
  }

  get destinations(){
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApi.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }

  getCityNames() {
    return this.#destinations.map((item) => item.name);
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getDestinationByName(name) {
    return this.#destinations.find((destination) => destination.name === name);
  }
}
