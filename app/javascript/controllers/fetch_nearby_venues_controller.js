import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["venueInput", "locationInput", "allInput", "tableBody", "spinner", "mainDiv"];

  static values = {
    apikey: String
  }

  connect() {
    const location = new URLSearchParams(window.location.search).get("location");
    if (location) {
      this.showSpinner();
      this.getCoordinates(location);  // Trigger search if redirected with location
    }
  }

  search(event) {
    if (this.allInputTarget.checked) {
      event.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.delete("location");
      url.searchParams.delete("venue");
      window.location.href = url.toString();
      return;
    }

    // If "location" input is used, prevent default form submission to handle it in JS
    if (this.locationInputTarget.value.trim()) {
      event.preventDefault();
      this.showSpinner();
      this.getCoordinates(this.locationInputTarget.value.trim());
      return;
    }
  }

  showSpinner() {
    this.spinnerTarget.style.display = "flex";
    this.mainDivTarget.classList.add("filter", "blur-sm");

  }

  hideSpinner() {
    this.spinnerTarget.style.display = "none";
    this.mainDivTarget.classList.remove("filter", "blur-sm");

  }

  getCoordinates(location) {
    const apiKey = this.apikeyValue;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          this.fetchNearbyVenues(lat, lng);
        } else {
          this.showNoVenuesMessage("Location not found.");
          this.hideSpinner();
        }
      })
      .catch(error => {
        console.error("Error fetching coordinates:", error);
        this.showNoVenuesMessage("Error fetching location coordinates.");
        this.hideSpinner();
      });
  }

  fetchNearbyVenues(latitude, longitude) {
    fetch(`/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute('content')
      },
      body: JSON.stringify({ latitude: latitude, longitude: longitude }),
    })
    .then(response => response.json())
    .then(data => {
      this.updateVenueTable(data.venues);
      this.hideSpinner();
    })
    .catch(error => {
      console.error("Error fetching venues:", error);
      this.showNoVenuesMessage("Error fetching venues.");
      this.hideSpinner();
    });
  }

  updateVenueTable(venues) {
    if (venues && venues.length > 0) {
      this.tableBodyTarget.innerHTML = ""; // Clear the "No venues" message

      venues.forEach(venue => {
        const row = document.createElement("tr");
        row.className = "odd:bg-white even:bg-saffron-mango-50 border-b";
        row.innerHTML = `
          <td scope="row" data-column="venue" class="px-3 py-2 font-medium text-saffron-mango-900 text-xs">
            <a href="/venues/${venue.slug}">${venue.name}</a>
          </td>
          <td scope="row" data-column="location" class="px-3 py-2 font-medium text-saffron-mango-900 text-xs">${venue.suburb}</td>
          <td scope="row" data-column="price" class="px-3 py-2 font-medium text-saffron-mango-900 text-xs text-right">${venue.price || "-"}</td>
          <td scope="row" data-column="rating" class="px-3 py-2 lg:pr-12 font-medium text-saffron-mango-900 text-xs text-right">${venue.rating}</td>
          `
        ;
        this.tableBodyTarget.appendChild(row);
      });
    } else {
      this.hideSpinner();
      this.showNoVenuesMessage("No nearby venues found.");
    }
  }

  showNoVenuesMessage(message) {
    // Clear any existing content in the table body
    this.tableBodyTarget.innerHTML = "";

    // Create and append the "no venues" message row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-3 py-2 font-medium text-saffron-mango-900 text-xs" colspan="4">${message}</td>
      `
    ;
    this.tableBodyTarget.appendChild(row);
  }
}
