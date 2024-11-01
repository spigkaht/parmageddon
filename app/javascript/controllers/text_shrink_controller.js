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
    textElement.style.maxWidth = `${window.innerWidth - 50}px`;
    // Start with a large initial font size to allow for resizing down
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 750) {
      textElement.style.fontSize = "1.7rem";
    } else if (viewportWidth < 1280) {
      textElement.style.fontSize = "2rem";
    } else if (viewportWidth < 1800) {
      return;
    } else {
      return;
    }

    // Adjust font size down until text fits within the width
    while (textElement.scrollWidth > textElement.clientWidth) {
      let currentSize = parseFloat(window.getComputedStyle(textElement).fontSize);
      textElement.style.fontSize = (currentSize - 1) + 'px';
      console.log("text size === ", textElement.style.fontSize);
    }

    // Ensure the font size doesn’t exceed 1.5rem after adjustments
    // let finalSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    // if (finalSize > 1.5 * 16) { // 1.5rem in pixels
    //   textElement.style.fontSize = "1.5rem";
    // }
  }
}
