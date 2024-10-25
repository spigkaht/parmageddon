import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text"]

  connect() {
    this.adjustTextWidth()
    window.addEventListener('resize', this.adjustTextWidth.bind(this))
  }

  disconnect() {
    window.removeEventListener('resize', this.adjustTextWidth.bind(this))
  }

  adjustTextWidth() {
    const textElement = this.textTarget;

    // Set the width of the element to be 20px smaller than the viewport width
    textElement.style.width = `${window.innerWidth - 50}px`;

    // Start with a large initial font size to allow for resizing down
    textElement.style.fontSize = "5rem";

    // Adjust font size down until text fits within the width
    while (textElement.scrollWidth > textElement.clientWidth) {
      let currentSize = parseFloat(window.getComputedStyle(textElement).fontSize);
      textElement.style.fontSize = (currentSize - 1) + 'px';
    }

    // Ensure the font size doesn’t exceed 1.5rem after adjustments
    let finalSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    if (finalSize > 1.5 * 16) { // 1.5rem in pixels
      textElement.style.fontSize = "1.5rem";
    }
  }
}
