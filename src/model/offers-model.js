export default class OffersModel {
  #offers = [];
  #offersApi = null;

  constructor({offersApi}) {
    this.#offersApi = offersApi;
  }

  get offers(){
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#offersApi.offers;
    } catch(err) {
      this.#offers = [];
    }
  }

  getOfferByType(type){
    return this.#offers.find((offer) => offer.type === type);
  }

  getOfferById(id){
    return this.#offers.find((offer) =>offer.id === id);
  }
}
