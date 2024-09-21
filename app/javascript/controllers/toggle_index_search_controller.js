import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "venueInput",
    "locationInput",
    "venueButton",
    "locationButton"
  ];

  connect() {
    console.log("connected!");
    console.log(this.venueInputTarget); // Check if it's defined
    console.log(this.locationInputTarget); // Check if it's defined
  }

  toggleVenueSearch() {
    console.log("toggling!"); // for verification
    this.venueInputTarget.classList.toggle("hidden");
    this.venueInputTarget.classList.toggle("flex");
    this.locationInputTarget.classList.add("hidden");
    this.locationInputTarget.classList.remove("flex");
    this.venueButtonTarget.classList.toggle("hidden");
    if (this.locationButtonTarget.classList.contains("hidden")) {
      this.locationButtonTarget.classList.toggle("hidden");
    }
  }

  toggleLocationSearch() {
    console.log("toggling!"); // for verification
    this.locationInputTarget.classList.toggle("hidden");
    this.locationInputTarget.classList.toggle("flex");
    this.venueInputTarget.classList.add("hidden");
    this.venueInputTarget.classList.remove("flex");
    this.locationButtonTarget.classList.toggle("hidden");
    if (this.venueButtonTarget.classList.contains("hidden")) {
      this.venueButtonTarget.classList.toggle("hidden");
    }
  }
}
