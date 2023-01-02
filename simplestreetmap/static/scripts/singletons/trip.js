class Trip {
  constructor() {
    this.journeys = new Array();
  }

  addJourney(journey) {
    this.journeys.push(journey)
  }
}

export default new Trip()

