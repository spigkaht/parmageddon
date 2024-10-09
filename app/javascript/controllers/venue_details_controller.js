import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingsDiv", "detailsDiv", "ratingsButton", "detailsButton"]

  showRatingsDiv() {
    this.ratingsDivTarget.classList.add("flex");
    this.ratingsDivTarget.classList.remove("hidden");
    this.ratingsButtonTarget.classList.add("bg-saffron-mango-400", "text-saffron-mango-900");
    this.ratingsButtonTarget.classList.remove("bg-transparent");
    this.detailsButtonTarget.classList.remove("bg-saffron-mango-400", "text-saffron-mango-900");
    this.detailsButtonTarget.classList.add("text-saffron-mango-700");
    this.detailsButtonTarget.classList.add("bg-transparent");
    this.detailsDivTarget.classList.add("hidden");
    this.detailsDivTarget.classList.remove("flex");
  }

  showDetailsDiv() {
    this.detailsDivTarget.classList.add("flex");
    this.detailsDivTarget.classList.remove("hidden");
    this.detailsButtonTarget.classList.add("bg-saffron-mango-400", "text-saffron-mango-900");
    this.detailsButtonTarget.classList.remove("bg-transparent");
    this.ratingsButtonTarget.classList.remove("bg-saffron-mango-400", "text-saffron-mango-900");
    this.ratingsButtonTarget.classList.add("text-saffron-mango-700");
    this.ratingsButtonTarget.classList.add("bg-transparent");
    this.ratingsDivTarget.classList.add("hidden");
    this.ratingsDivTarget.classList.remove("flex");
  }
}
