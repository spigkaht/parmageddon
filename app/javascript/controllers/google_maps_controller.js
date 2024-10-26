import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv", "loaderDiv"];
  static values = {
    page: String
  }
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
    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      console.error("Google Maps API is not loaded yet.");
      return;
    }

    if (this.map) {
      console.log("Map is already initialized");
      return;
    }

    if (!this.mapDivTarget || this.mapDivTarget.offsetHeight === 0) {
      console.error("Map div is not ready or has no height.");
      return;
    }

    const { Map } = await google.maps.importLibrary("maps");
    await google.maps.importLibrary("geometry");
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
        // this.drawRectangle(data.bounds);
        return this.plotMarkers(data.venues);
      })
      .catch(error => console.error('Error fetching venues:', error));
  }

  async plotMarkers(venues) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    this.currentInfoWindow = null;
    this.currentMarker = null;

    this.mapDivTarget.addEventListener("click", (event) => {
      if (!event.target.closest(".marker-img") && !event.target.closest("#infoDiv")) {
        if (this.currentMarker) {
          const previousMarkerImg = this.currentMarker.content.querySelector(".marker-img");
          const previousInfoDiv = this.currentMarker.content.querySelector("#infoDiv");

          previousMarkerImg.style.width = "30px";
          previousMarkerImg.style.height = "30px";
          previousInfoDiv.classList.add("hidden");
          previousInfoDiv.classList.remove("flex");

          this.currentMarker.zIndex = google.maps.Marker.MAX_ZINDEX - 1;
          this.currentMarker = null;
        }
      }
    });

    venues.forEach(venue => {
      const position = new google.maps.LatLng(parseFloat(venue.lat), parseFloat(venue.lng));
      const content = document.createElement("div");

      const venueUrl = `/venues/${venue.slug}`;
      const venueLink = `<a href="${venueUrl}" class="text-saffron-mango-600 hover:text-saffron-mango-800 font-bold text-base">View</a>`;

      content.classList.add("flex", "flex-col", "justify-between", "items-center", "relative", "z-50")
      content.innerHTML = `
      <div class="hidden flex-col bg-saffron-mango-400 text-saffron-mango-950 opacity-90 rounded-md border border-saffron-mango-950 py-0.5 px-1.5" id="infoDiv">
        <p class="font-bold text-base">${venue.name}</p>
        <div class="flex justify-between items-center">
          <div class="flex">
            <span class="material-symbols-sharp !font-bold !text-xl mr-1" title=${venue.name}>
            star
            </span>
            <p class="text-lg">${venue.rating}</p>
          </div>
          ${venueLink}
        </div>
      </div>
      <div class="flex justify-center items-center" style="width: 50px; height: 50px;">
        <img src="https://res.cloudinary.com/dp0apr6y4/image/upload/v1718612885/chicken-marker_ecqxfi.svg" class="marker-img transition-[width]" style="width:30px;height:30px;margin-top:-2px;">
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
        this.map.setZoom(13);

        const markerImg = marker.content.querySelector(".marker-img");
        const infoDiv = marker.content.querySelector("#infoDiv");

        if (this.currentMarker === marker) {
          markerImg.style.width = "30px";
          markerImg.style.height = "30px";
          infoDiv.classList.add("hidden");
          infoDiv.classList.remove("flex");
          marker.zIndex = google.maps.Marker.MAX_ZINDEX - 1;
          this.currentMarker = null;
        } else {
          if (this.currentMarker) {
            const previousMarkerImg = this.currentMarker.content.querySelector(".marker-img");
            const previousInfoDiv = this.currentMarker.content.querySelector("#infoDiv");
            previousMarkerImg.style.width = "30px";
            previousMarkerImg.style.height = "30px";
            previousInfoDiv.classList.add("hidden");
            previousInfoDiv.classList.remove("flex");
            this.currentMarker.zIndex = google.maps.Marker.MAX_ZINDEX - 1;
          }
          this.animateMapCenter(position);
          markerImg.style.width = "50px";
          markerImg.style.height = "50px";
          infoDiv.classList.remove("hidden");
          infoDiv.classList.add("flex");
          marker.zIndex = google.maps.Marker.MAX_ZINDEX + 1;

          this.currentMarker = marker;
        }
      });

      this.bounds.extend(marker.position);
    });

    if (venues.length > 0) {
      this.map.fitBounds(this.bounds);
    }
  }

  runAfterAsync(...asyncFunctions) {
    const timeout = setTimeout(() => {
      this.loaderDivTarget.classList.add("loading-long");
    }, 5000);

    Promise.all(asyncFunctions).then(() => {
      clearTimeout(timeout);
      this.afterAllAsyncActions();
    });
  }

  afterAllAsyncActions() {
    this.mapDivTarget.classList.remove("opacity-50");
    this.loaderDivTarget.classList.add("hidden");
    this.mapDivTarget.classList.remove("filter", "blur-sm");
  }

  centerMap() {
    const center = this.map.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    window.location.href = `?latitude=${lat}&longitude=${lng}`;
  }

  animateMapCenter(newCenter) {
    const map = this.map;

    const adjustedNewCenter = {
      lat: newCenter.lat() + 0.005,
      lng: newCenter.lng()
    };

    const currentCenter = map.getCenter();
    const latDiff = adjustedNewCenter.lat - currentCenter.lat();
    const lngDiff = adjustedNewCenter.lng - currentCenter.lng();
    const steps = 10;
    let stepCount = 0;

    function animate() {
      stepCount += 1;
      const lat = currentCenter.lat() + (latDiff * stepCount) / steps;
      const lng = currentCenter.lng() + (lngDiff * stepCount) / steps;
      map.setCenter({ lat, lng });

      if (stepCount < steps) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // drawRectangle(bounds) {
  //   const { Rectangle } = google.maps;

  //   const rectangleBounds = {
  //     north: bounds.high_latitude,
  //     south: bounds.low_latitude,
  //     east: bounds.high_longitude,
  //     west: bounds.low_longitude,
  //   };

  //   // Create and display the rectangle on the map
  //   const rectangle = new google.maps.Rectangle({
  //     bounds: rectangleBounds,
  //     map: this.map,
  //     strokeColor: "#FF0000",  // Border color
  //     strokeOpacity: 0.8,
  //     strokeWeight: 2,
  //     fillColor: "#FF0000",
  //     fillOpacity: 0.1,
  //   });
  // }

  initDefaultMap() {
    const mapOptions = {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 11,
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    this.map = new Map(this.mapDivTarget, mapOptions);
  }

  disconnect() {
    if (this.map && !document.body.contains(this.mapDivTarget)) {
      google.maps.event.clearInstanceListeners(this.map);
      this.map = null;
    }
  }
}
