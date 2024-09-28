import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];
  bounds = null;

  connect() {
    this.checkForCoordinatesInParams();
  }

  // Check for coordinates in the URL
  checkForCoordinatesInParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = parseFloat(urlParams.get("latitude"));
    const longitude = parseFloat(urlParams.get("longitude"));

    if (!isNaN(latitude) && !isNaN(longitude)) {
      this.initMap(latitude, longitude);
      this.getVenues(latitude, longitude);
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

    await this.initMap(latitude, longitude);
    this.getVenues(latitude, longitude);
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
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    this.map = new Map(this.mapDivTarget, mapOptions);
  }

  getVenues(latitude, longitude) {
    fetch('/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: JSON.stringify({ latitude: latitude, longitude: longitude }),
    })
      .then(response => response.json())
      .then(data => {
        this.plotMarkers(data.venues);
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
      <div class="hidden flex-col bg-white" id="infoDiv">
        <p>${venue.name}</p>
        <div class="flex">
          <span class="material-symbols-outlined" title=${venue.name}>
          star
          </span>
          <p>${venue.total_rating_average}</p>
        </div>
      </div>
      <div>
        <img src="https://res.cloudinary.com/dp0apr6y4/image/upload/v1718612885/chicken-marker_rivnug.svg" style="width:40px;height:40px;">
      </div>
      `;

      // const infowindow = new google.maps.InfoWindow({
      //   content: contentString,
      // });

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: position,
        content: content,
        title: venue.name,
        gmpClickable: true
      });

      marker.addListener("click", () => {
        const infoDiv = marker.content.querySelector("#infoDiv");
        console.log(infoDiv);
        if (infoDiv.classList.contains("hidden")) {
          infoDiv.classList.remove("hidden");
          marker.zIndex = null;
          console.log("hiding marker");
          console.log(infoDiv);
        } else {
          infoDiv.classList.add("hidden");
          marker.zIndex = 1;
          console.log(infoDiv);
          console.log("showing marker");
        }
      });

      // marker.addListener("click", () => {
      //   infowindow.open({
      //     anchor: marker,
      //     map: this.map,
      //   });
      // });

      this.bounds.extend(marker.position);
    });

    if (venues.length > 0) {
      this.map.fitBounds(this.bounds);
    }
  }

  centerMap() {
    const center = this.map.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    // Redirect the page with lat and lng as URL parameters
    window.location.href = `?latitude=${lat}&longitude=${lng}`;
  }
}
