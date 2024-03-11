import { destinations } from '../mock/destination.js';

export default class DestinationsModel {
  destinations = destinations;

  getDestinations(){
    return this.destinations;
  }

  getDestinationById(id){
    return this.destinations.find((destination) => destination.id === id);
  }
}
