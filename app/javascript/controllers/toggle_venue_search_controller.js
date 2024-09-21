import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["venueInput", "locationInput"]

  toggleVenueSearch() {
    this.venueInputTarget.classList.remove("hidden");
    this.venueInputTarget.classList.add("flex");
    this.locationInputTarget.classList.add("hidden");
    this.locationInputTarget.classList.remove("flex");
  }

  toggleLocationSearch() {
    this.locationInputTarget.classList.remove("hidden");
    this.locationInputTarget.classList.add("flex");
    this.venueInputTarget.classList.add("hidden");
    this.venueInputTarget.classList.remove("flex");
  }
}
