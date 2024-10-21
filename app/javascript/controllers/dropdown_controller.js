import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "lines", "cross"]

  toggleMenu() {
    if (this.menuTarget.classList.contains("hidden")) {
      this.menuTarget.classList.add("flex");
      this.menuTarget.classList.remove("hidden");

      this.linesTarget.classList.add("opacity-0", "scale-0");
      this.linesTarget.classList.remove("opacity-100", "scale-100");

      this.crossTarget.classList.add("opacity-100", "scale-100");
      this.crossTarget.classList.remove("opacity-0", "scale-0");
    } else {
      this.menuTarget.classList.add("hidden");
      this.menuTarget.classList.remove("flex");

      this.crossTarget.classList.add("opacity-0", "scale-0");
      this.crossTarget.classList.remove("opacity-100", "scale-100");

      this.linesTarget.classList.add("opacity-100", "scale-100");
      this.linesTarget.classList.remove("opacity-0", "scale-0");
    }
  }
}
