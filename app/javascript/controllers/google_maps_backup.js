import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv"];
  static values = {
    apiKey: String,
    location: String,
    venues: Array
  }

  connect() {
    this.initMap().then(() => {
      const event = new CustomEvent("gmaps:connected", { detail: { controller: this } });
      document.dispatchEvent(event);
    }).catch(error => {
      console.log("Error initializing map: ", error);
    });
  }

  async initMap() {
    try {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement, InfoWindow } = await google.maps.importLibrary("marker");
      const { Geocoder } = await google.maps.importLibrary("geocoding");

      const geocoder = new Geocoder();
      const bounds = new google.maps.LatLngBounds();

      const mapOptions = {
        zoom: 11,
        disableDefaultUI: true,
        mapId: "8920b6736ae8305a"
      };

      this.map = new Map(this.mapDivTarget, mapOptions);

      const locationResponse = await geocoder.geocode({ address: this.locationValue });
      if (locationResponse.results[0]) {
        this.map.setCenter(locationResponse.results[0].geometry.location);
      } else {
        window.alert("No results for postcode found");
      }

      this.markers = {};
      this.currentInfoWindow = null; // Keep track of the currently open InfoWindow

      for (const venue of this.venuesValue) {
        const address = `${venue.street}, ${venue.city}, ${venue.state}, ${venue.postcode}`;
        const venueResponse = await geocoder.geocode({ address: address });

        if (venueResponse.results[0]) {
          const position = venueResponse.results[0].geometry.location;
          const markerImg = document.createElement("img");
          markerImg.src = "https://res.cloudinary.com/dp0apr6y4/image/upload/v1718612885/chicken-marker_rivnug.svg";
          markerImg.style.width = "50px";
          markerImg.style.height = "50px";
          markerImg.className = "markerImage";
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

          this.markers[venue.name] = marker;

          marker.addListener("click", () => {
            this.map.setZoom(18);
            this.map.setCenter(marker.position);

            if (this.currentInfoWindow) {
              this.currentInfoWindow.close(); // Close the currently open InfoWindow
            }

            infowindow.open({
              anchor: marker,
              map: this.map,
            });

            this.currentInfoWindow = infowindow; // Update the reference to the currently open InfoWindow

            const activeElement = document.querySelector(".active");
            if (activeElement) {
              activeElement.classList.remove("active");
            }
            const venueDiv = document.querySelector(`[data-venue-title="${venue.name}"]`);
            if (venueDiv) {
              venueDiv.classList.add("active"); // Add the class "active"
            }

            // Add a listener for the 'closeclick' event to reset the zoom level
            infowindow.addListener("closeclick", () => {
              this.map.setZoom(15);
            });
          });

          bounds.extend(marker.position);
        } else {
          window.alert("No results for venue found");
        }
      }
      this.map.fitBounds(bounds);
    } catch (error) {
      console.log("Geocoding error: ", error.message);
      window.alert("Geocoding error: " + error.message);
    }
  }

  clickMarker(venueName) {
    const marker = this.markers[venueName];
    if (marker) {
      google.maps.event.trigger(marker, "click");
    } else {
      console.log(`Marker for venue "${venueName}" not found.`);
    }
  }
}
