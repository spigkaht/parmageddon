import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["venue", "location"]

  showVenue() {
    this.venueTarget.classList.add("block");
    this.venueTarget.classList.remove("hidden");
    this.locationTarget.classList.add("hidden");
  }

  showLocation() {
    this.locationTarget.classList.add("block");
    this.locationTarget.classList.remove("hidden");
    this.venueTarget.classList.add("hidden");
  }
}
