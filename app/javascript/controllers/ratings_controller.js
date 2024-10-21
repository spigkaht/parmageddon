import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingInput", "ratingGroup"]

  setRating(event) {
    const ratingValue = event.currentTarget.dataset.value;
    const ratingGroup = event.currentTarget.closest(".rating-group");

    const buttons = ratingGroup.querySelectorAll(".rating-button");
    buttons.forEach(button => button.classList.remove("bg-saffron-mango-500", "text-white", "border-transparent"));
    event.currentTarget.classList.add("bg-saffron-mango-500", "text-white", "border-transparent");

    const ratingInput = ratingGroup.querySelector("[data-ratings-target='ratingInput']");
    if (ratingInput) {
      ratingInput.value = ratingValue;
    }
  }

  validate(event) {
    let allValid = true;

    this.ratingInputTargets.forEach((ratingInput) => {
      if (ratingInput.value === "") {
        allValid = false;
      }
    });

    if (!allValid) {
      event.preventDefault();
      alert("All ratings are required.");
    }
  }
}
