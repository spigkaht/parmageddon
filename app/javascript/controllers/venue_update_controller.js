import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["venueDetails"]

  updateUrl(event) {
    // Get the new venue ID from the link's href attribute
    const newUrl = event.target.href;

    // Push the new state to the browser's history
    history.replaceState(null, "", newUrl);
  }
}
