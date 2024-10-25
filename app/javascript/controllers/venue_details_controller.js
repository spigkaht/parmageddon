import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ratingsDiv", "detailsDiv", "totalsDiv", "formDiv", "buttonsDiv"]

  connect() {
    this.element.addEventListener("turbo:submit-end", this.resetView.bind(this))
  }

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
    this.formDivTarget.classList.add("hidden");
  }

  showDetails() {
    this.detailsDivTarget.classList.remove("hidden");
    this.ratingsDivTarget.classList.add("hidden");
    this.totalsDivTarget.classList.add("hidden");
    this.formDivTarget.classList.add("hidden");
  }

  showForm() {
    this.formDivTarget.classList.remove("hidden");
    this.ratingsDivTarget.classList.add("hidden");
    this.detailsDivTarget.classList.add("hidden");
    this.totalsDivTarget.classList.add("hidden");
    this.buttonsDivTarget.classList.add("hidden");
  }

  resetView() {
    // Reset the visibility of the divs after form submission
    this.showRatings(); // Or showDetails, depending on what you want to display after submission
  }
}
