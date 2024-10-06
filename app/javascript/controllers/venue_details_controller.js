import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingsDiv", "detailsDiv", "ratingsButton", "detailsButton"]

  connect() {
    this.ratingsButtonTarget.classList.add("bg-akaroa-200");
    this.ratingsButtonTarget.classList.remove("bg-transparent");
    this.detailsButtonTarget.classList.remove("bg-akaroa-200");
    this.detailsButtonTarget.classList.add("bg-transparent");
  }

  showRatingsDiv() {
    this.ratingsDivTarget.classList.add("flex");
    this.ratingsDivTarget.classList.remove("hidden");
    this.ratingsButtonTarget.classList.add("bg-akaroa-200");
    this.ratingsButtonTarget.classList.remove("bg-transparent");
    this.detailsButtonTarget.classList.remove("bg-akaroa-200");
    this.detailsButtonTarget.classList.add("bg-transparent");
    this.detailsDivTarget.classList.add("hidden");
    this.detailsDivTarget.classList.remove("flex");
  }

  showDetailsDiv() {
    this.detailsDivTarget.classList.add("flex");
    this.detailsDivTarget.classList.remove("hidden");
    this.detailsButtonTarget.classList.add("bg-akaroa-200");
    this.detailsButtonTarget.classList.remove("bg-transparent");
    this.ratingsButtonTarget.classList.remove("bg-akaroa-200");
    this.ratingsButtonTarget.classList.add("bg-transparent");
    this.ratingsDivTarget.classList.add("hidden");
    this.ratingsDivTarget.classList.remove("flex");
  }
}
