import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingsDiv", "detailsDiv", "formDiv", "buttonsDiv", "mapDiv", "ratingsButton", "detailsButton", "formButton"]

  connect() {
    this.element.addEventListener("turbo:submit-end", this.resetView.bind(this))
  }

  showRatings() {
    this.ratingsDivTarget.classList.remove("hidden");
    this.ratingsButtonTarget.classList.add("bg-saffron-mango-400", "text-saffron-mango-900");
    this.ratingsButtonTarget.classList.remove("bg-transparent");
    this.detailsButtonTarget.classList.remove("bg-saffron-mango-400", "text-saffron-mango-900");
    this.detailsButtonTarget.classList.add("text-saffron-mango-700");
    this.detailsButtonTarget.classList.add("bg-transparent");
    this.detailsDivTarget.classList.add("hidden");
    this.formDivTarget.classList.add("hidden");
  }

  showDetails() {
    this.detailsDivTarget.classList.remove("hidden");
    this.detailsButtonTarget.classList.add("bg-saffron-mango-400", "text-saffron-mango-900");
    this.detailsButtonTarget.classList.remove("bg-transparent");
    this.ratingsButtonTarget.classList.remove("bg-saffron-mango-400", "text-saffron-mango-900");
    this.ratingsButtonTarget.classList.add("text-saffron-mango-700");
    this.ratingsButtonTarget.classList.add("bg-transparent");
    this.ratingsDivTarget.classList.add("hidden");
    this.formDivTarget.classList.add("hidden");
  }

  showForm() {
    this.formDivTarget.classList.remove("hidden");
    this.ratingsDivTarget.classList.add("hidden");
    this.detailsDivTarget.classList.add("hidden");
    this.buttonsDivTarget.classList.add("hidden");
    this.mapDivTarget.classList.add("hidden");
  }

  resetView() {
    // Reset the visibility of the divs after form submission
    this.showRatings() // Or showDetails, depending on what you want to display after submission
  }
}
