import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["flashDiv"]

  connect() {
    setTimeout(() => {
      this.flashDivTargets.forEach((div) => {
        div.style.display = "none";
      });
    }, 5000);
  }

  close() {
    this.flashDivTargets.forEach((div) => {
      div.style.display = "none";
    })
  }
}
