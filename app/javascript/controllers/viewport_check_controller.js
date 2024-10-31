import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "unsupportedMessage"]

  initialize() {
    // Store the initial viewport height to detect changes
    this.initialHeight = window.innerHeight;
  }

  connect() {
    this.checkViewportHeight(); // Run the check on initial load
    window.addEventListener("resize", this.checkViewportHeight.bind(this)); // Re-check on resize
  }

  disconnect() {
    window.removeEventListener("resize", this.checkViewportHeight.bind(this));
  }

  checkViewportHeight() {
    const currentHeight = window.innerHeight;

    // Check if the viewport is under 600px and shrunk significantly due to keyboard activation
    if (currentHeight < this.initialHeight * 0.6 && currentHeight < 600) {
      // Show unsupported message and hide main content
      this.contentTarget.classList.add("hidden");
      this.unsupportedMessageTarget.classList.remove("hidden");
      console.log("Keyboard likely active, viewport height:", currentHeight);
    } else {
      // Show main content and hide unsupported message
      this.contentTarget.classList.remove("hidden");
      this.unsupportedMessageTarget.classList.add("hidden");
    }
  }
}
