import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];

  connect() {
    this.initMap().then(() => {
      const event = new CustomEvent("gmaps:connected", { detail: { controller: this } });
      document.dispatchEvent(event);
    }).catch(error => {
      console.log("Error initializing map: ", error);
    });
  }

  async initMap() {
    const success = async (pos) => {
      const crd = pos.coords;

      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);

      // Wait for map libraries to load
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      // Initialize map with user's current position as center
      const mapOptions = {
        center: { lat: crd.latitude, lng: crd.longitude },
        zoom: 11,
        disableDefaultUI: true,
        mapId: "8920b6736ae8305a",
      };

      this.map = new Map(this.mapDivTarget, mapOptions);
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);

      // Fallback in case of error (optional: set default location)
      this.initDefaultMap();
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Get current position, then initialize the map
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  async initDefaultMap() {
    // Fallback method to initialize the map with a default location
    const { Map } = await google.maps.importLibrary("maps");
    const mapOptions = {
      center: {lat: -37.8136, lng: 144.9631}, // Default center (e.g., Melbourne)
      zoom: 11,
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    this.map = new Map(this.mapDivTarget, mapOptions);
  }
}
