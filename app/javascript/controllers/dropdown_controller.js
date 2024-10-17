import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  connect() {
    console.log("connected!");
  }

  toggleMenu() {
    console.log("clicky");
    if (this.menuTarget.classList.contains("hidden")) {
      this.menuTarget.classList.add("flex");
      this.menuTarget.classList.remove("hidden");
    } else {
      this.menuTarget.classList.add("hidden");
      this.menuTarget.classList.remove("flex");
    }
  }
}
