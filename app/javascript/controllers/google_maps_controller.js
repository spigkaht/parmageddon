import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];
  static values = {
    markers: Array
  };

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

      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const bounds = new google.maps.LatLngBounds();

      const mapOptions = {
        center: { lat: crd.latitude, lng: crd.longitude },
        zoom: 11,
        disableDefaultUI: true,
        mapId: "8920b6736ae8305a",
      };

      this.map = new Map(this.mapDivTarget, mapOptions);

      for (const marker_coords of this.markersValue) {
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: {
            lat: parseFloat(marker_coords.lat),
            lng: parseFloat(marker_coords.lng)
          },
        })
        bounds.extend(marker.position);
      }

      this.map.fitBounds(bounds);
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      this.initDefaultMap();
    };

    navigator.geolocation.getCurrentPosition(success, error);
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
