import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv", "loaderDiv"];
  bounds = null;

  connect() {
    this.checkForCoordinatesInParams();
  }

  checkForCoordinatesInParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = parseFloat(urlParams.get("latitude"));
    const longitude = parseFloat(urlParams.get("longitude"));

    if (!isNaN(latitude) && !isNaN(longitude)) {
      this.runAfterAsync(this.initMap(latitude, longitude), this.getVenues(latitude, longitude));
    } else {
      this.getUserLocation();
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      alert("Unable to retrieve your location");
      this.initDefaultMap();
    }
  }

  async success(position) {
    const latitude = position.coords.latitude || -37.8136;
    const longitude = position.coords.longitude || 144.9631;

    this.runAfterAsync(this.initMap(latitude, longitude), this.getVenues(latitude, longitude));
  }

  error() {
    console.log("Unable to retrieve your location.");
    this.initDefaultMap();
  }

  async initMap(lat, lng) {
    if (!this.mapDivTarget || this.mapDivTarget.offsetHeight === 0) {
      console.error("Map div is not ready or has no height.");
      return;
    }

    const { Map } = await google.maps.importLibrary("maps");
    this.bounds = new google.maps.LatLngBounds();

    const mapOptions = {
      center: { lat: lat, lng: lng },
      zoom: 11,
      mapId: "8920b6736ae8305a",
    };

    this.map = new Map(this.mapDivTarget, mapOptions);
  }

  getVenues(latitude, longitude) {
    return fetch('/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: JSON.stringify({ latitude: latitude, longitude: longitude }),
    })
      .then(response => response.json())
      .then(data => {
        return this.plotMarkers(data.venues);
      })
      .catch(error => console.error('Error fetching venues:', error));
  }

  async plotMarkers(venues) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    this.currentInfoWindow = null;

    venues.forEach(venue => {
      const position = new google.maps.LatLng(parseFloat(venue.lat), parseFloat(venue.lng));
      const content = document.createElement("div");
      content.classList.add("flex", "flex-col", "justify-between", "items-center", "relative")
      content.innerHTML = `
      <div class="hidden flex-col bg-orange-500 text-slate-900 opacity-90 rounded-md border border-gray-900 py-0.5 px-1.5" id="infoDiv">
        <p class="font-bold text-base">${venue.name}</p>
        <div class="flex justify-between items-center">
          <div class="flex">
            <span class="material-symbols-outlined !font-bold !text-xl mr-1" title=${venue.name}>
            star
            </span>
            <p class="text-lg">${venue.rating}</p>
          </div>
          <a href="/venues/${venue.id}" class="ml-2 text-lg text-blue-600">view</a>
        </div>
      </div>
      <div>
        <img src="https://res.cloudinary.com/dp0apr6y4/image/upload/v1718612885/chicken-marker_rivnug.svg" style="width:40px;height:40px;margin-top:-5px;">
      </div>
      `;

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: position,
        content: content,
        title: venue.name,
        gmpClickable: true
      });

      marker.addListener("click", () => {
        const infoDiv = marker.content.querySelector("#infoDiv");
        if (infoDiv.classList.contains("hidden")) {
          infoDiv.classList.remove("hidden");
          infoDiv.classList.add("flex");
          marker.zIndex = null;
        } else {
          infoDiv.classList.add("hidden");
          infoDiv.classList.remove("flex");
          marker.zIndex = 1;
        }
      });

      this.bounds.extend(marker.position);
    });

    if (venues.length > 0) {
      this.map.fitBounds(this.bounds);
    }
  }

  runAfterAsync(...asyncFunctions) {
    Promise.all(asyncFunctions).then(() => {
      console.log("All asynchronous actions completed!");
      this.afterAllAsyncActions();
    });
  }

  afterAllAsyncActions() {
    console.log("Post-async operations completed.");
    this.mapDivTarget.classList.remove("opacity-50");
    this.loaderDivTarget.classList.add("hidden");
  }

  centerMap() {
    const center = this.map.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    window.location.href = `?latitude=${lat}&longitude=${lng}`;
  }
}
