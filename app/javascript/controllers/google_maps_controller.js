import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];
  bounds = null;

  connect() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), {
        enableHighAccuracy: true,  // Request higher accuracy
        timeout: 5000,  // Wait up to 5 seconds for a response
        maximumAge: 0  // Don't use cached positions
      });
    } else {
      alert("Unable to retrieve your location");
      this.initDefaultMap();
    }
  }

  async success(position) {
    console.log("Full position object:", position);  // Log everything
    let latitude = 0;
    let longitude = 0;

    if (position && position.coords) {
      if (position.coords.accuracy < 1000) {
        latitude = parseFloat(position.coords.latitude);
        longitude = parseFloat(position.coords.longitude);
      } else {
        latitude = -37.8136;
        longitude = 144.9631;
      }

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid latitude or longitude");
        return this.initDefaultMap();
      }

      console.log("lat: ", latitude, "lng: ", longitude);
      // Initialize the map and set the center in the initMap function
      await this.initMap(latitude, longitude);

      // Fetch and plot venues
      this.getVenues(latitude, longitude);

    } else {
      console.error("Geolocation failed");
      this.initDefaultMap();
    }
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

    // Log the lat and lng to make sure they are correct
    console.log("Initializing map with center lat:", lat, "lng:", lng);

    const mapOptions = {
      center: { lat: lat, lng: lng },  // Set the center during initialization
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

      // Extend the bounds to include the marker's position
      this.bounds.extend(marker.position);
    });

    // Only call fitBounds if there are valid markers
    if (venues.length > 0) {
      console.log("Fitting bounds with calculated markers");
      this.map.fitBounds(this.bounds);
    }
  }

  initDefaultMap() {
    const mapOptions = {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 11,
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    console.log("Initializing FALLBACK map with center lat:", lat, "lng:", lng);
    this.map = new google.maps.Map(this.mapDivTarget, mapOptions);
  }
}
