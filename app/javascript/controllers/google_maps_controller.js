import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];
  bounds = null;

  connect() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this));
    } else {
      alert("Unable to retrieve your location");
      this.initDefaultMap();
    }
  }

  async success(position) {
    if (position && position.coords) {
    const latitude = parseFloat(position.coords.latitude);
    const longitude = parseFloat(position.coords.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid latitude or longitude");
      return this.initDefaultMap();
    }

    await this.initMap(latitude, longitude);
    this.map.setCenter({ lat: latitude, lng: longitude });

    this.getVenues(latitude, longitude);

    window.setTimeout(() => {
      console.log("Triggering debugger after 3 seconds...");
      debugger;  // This will trigger the debugger 3 seconds after the page has fully loaded

      // Check the map state
      console.log("Map Center:", this.map.getCenter().toString());
    }, 3000);  // 3000ms = 3 seconds

    } else {
      console.error("Geolocation failed");
      this.initDefaultMap();
    }
  }

  error() {
    alert("Unable to retrieve your location.");
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

    venues.forEach(venue => {
      const position = new google.maps.LatLng(parseFloat(venue.lat), parseFloat(venue.lng));
      const markerImg = document.createElement("img");
      markerImg.src = "https://res.cloudinary.com/dp0apr6y4/image/upload/v1718612885/chicken-marker_rivnug.svg";
      markerImg.style.width = "40px";
      markerImg.style.height = "40px";
      const contentString =
      `<div class="infoWindow">
      <p>${venue.name}</p>
      <i class="fa-regular fa-star"></i>
      <p>${venue.rating_average}</p>
      </div>`;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: position,
        content: markerImg,
        title: venue.name,
        gmpClickable: true
      });

      this.bounds.extend(marker.position);
    });

    this.map.fitBounds(this.bounds);
  }

  initDefaultMap() {
    const mapOptions = {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 11,
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    this.map = new google.maps.Map(this.mapDivTarget, mapOptions);
  }
}
