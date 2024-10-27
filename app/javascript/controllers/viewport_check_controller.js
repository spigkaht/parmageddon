import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "unsupportedMessage"]

  connect() {
    this.checkViewportHeight() // Run the check on initial load
    window.addEventListener("resize", this.checkViewportHeight.bind(this)) // Re-check on resize
  }

  disconnect() {
    window.removeEventListener("resize", this.checkViewportHeight.bind(this))
  }

  checkViewportHeight() {
    if (window.innerHeight < 600) {
      // If viewport is under 600px, show unsupported message and hide main content
      this.contentTarget.classList.add("hidden")
      this.unsupportedMessageTarget.classList.remove("hidden")
    } else {
      // Otherwise, show main content and hide unsupported message
      this.contentTarget.classList.remove("hidden")
      this.unsupportedMessageTarget.classList.add("hidden")
    }
  }
}
