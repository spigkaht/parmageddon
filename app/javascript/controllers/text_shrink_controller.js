import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text"]

  connect() {
    this.checkOverflow()
    window.addEventListener('resize', this.checkOverflow.bind(this));
  }

  disconnect() {
    window.removeEventListener('resize', this.checkOverflow.bind(this));
  }

  checkOverflow() {
    const textElement = this.textTarget;
    textElement.style.fontSize = "1.5rem";

    while (textElement.scrollWidth > textElement.clientWidth) {
      let currentSize = parseFloat(window.getComputedStyle(textElement).fontSize);
      textElement.style.fontSize = (currentSize - 1) + 'px';
    }
  }
}
