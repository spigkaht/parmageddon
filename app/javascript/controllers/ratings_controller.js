import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingInput", "ratingGroup"]

  connect() {
    console.log("Rating controller connected");
  }

  setRating(event) {
    const ratingValue = event.currentTarget.dataset.value;
    const ratingGroup = event.currentTarget.closest(".rating-group");

    const ratingInput = ratingGroup.querySelector("[data-ratings-target='ratingInput']");

    if (ratingInput) {
      ratingInput.value = ratingValue;
    }
  }
}
