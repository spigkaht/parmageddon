import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingsDiv", "detailsDiv", "totalsDiv", "buttonsDiv"]

  handleSelect(event) {
    const selectedValue = event.target.value

    if (selectedValue === "ratings") {
      this.showRatings();
    } else if (selectedValue === "details") {
      this.showDetails();
    }
  }

  showRatings() {
    this.ratingsDivTarget.classList.remove("hidden");
    this.detailsDivTarget.classList.add("hidden");
    this.totalsDivTarget.classList.remove("hidden");
  }

  showDetails() {
    this.detailsDivTarget.classList.remove("hidden");
    this.ratingsDivTarget.classList.add("hidden");
    this.totalsDivTarget.classList.add("hidden");
  }
}
