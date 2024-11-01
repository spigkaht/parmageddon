import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mapDiv", "loaderDiv"];
  static values = {
    page: String,
    lat: Number,
    lng: Number,
    initialLoad: Boolean,
    markerClicked: Boolean
  }

  connect() {
    const activeMapDiv = this.mapDivTargets.find(
      (mapDiv) => mapDiv.offsetParent !== null
    );

    if (!activeMapDiv) {
      return;
    }

    if ((this.isHidden(activeMapDiv)) && this.pageValue === "index") {
      console.log("Map already initialized or is hidden");
      return;
    }

    window.mapInitialized = true;
    this.initializeMap(activeMapDiv);
  }

  isHidden(element) {
    return element.offsetParent === null || window.getComputedStyle(element).visibility === "hidden";
  }

  initializeMap(mapDiv) {
    const urlParams = new URLSearchParams(window.location.search);
    this.initialLoadValue = urlParams.get("initialLoad") === "true";
    this.markerClickedValue = urlParams.get("markerClicked") === "true";

    if ((this.initialLoadValue || this.markerClickedValue) && this.hasLatValue && this.hasLngValue) {
      this.runAfterAsync(
        this.initMapOnce(this.latValue, this.lngValue, mapDiv),
        this.getVenues(this.latValue, this.lngValue)
      );
    } else {
      this.checkForCoordinatesInParams(mapDiv);
    }
  }

  initMapOnce(lat, lng, mapDiv) {
    if (this.map) {
      console.log("Map is already initialized");
      return;
    }
    this.initMap(lat, lng, mapDiv);
  }

  async initMap(lat, lng, mapDiv) {
    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      console.error("Google Maps API is not loaded yet.");
      return;
    }

    if (!mapDiv || mapDiv.offsetHeight === 0) {
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

    this.map = new Map(mapDiv, mapOptions);
  }

  checkForCoordinatesInParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = parseFloat(urlParams.get("latitude"));
    const longitude = parseFloat(urlParams.get("longitude"));

    if (!isNaN(latitude) && !isNaN(longitude)) {
      this.runAfterAsync(this.initMapOnce(latitude, longitude), this.getVenues(latitude, longitude));
    } else {
      this.getUserLocation();
    }
  }

  getUserLocation() {
    if (this.markerClickedValue) return;

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

    this.runAfterAsync(this.initMapOnce(latitude, longitude), this.getVenues(latitude, longitude));
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
        // Process the venues for plotting markers
        this.plotMarkers(data.venues);
      })
      .catch(error => console.error('Error fetching venues:', error));
  }

  async plotMarkers(venues) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    this.currentInfoWindow = null;
    this.currentMarker = null;

    const currentLat = this.latValue;
    const currentLng = this.lngValue;

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

      const venueUrl = `/venues/${venue.slug}?latitude=${venue.lat}&longitude=${venue.lng}`;
      const venueLink = `<a href="${venueUrl}" class="text-saffron-mango-700 hover:text-saffron-mango-900 font-bold text-base">View</a>`;

      content.classList.add("flex", "flex-col", "justify-between", "items-center", "relative", "z-50")
      content.innerHTML = `
      <div class="hidden flex-col min-w-32 bg-saffron-mango-400 text-saffron-mango-950 opacity-90 rounded-md border border-saffron-mango-950 py-0.5 px-1.5" id="infoDiv">
        <p class="font-bold text-base">${venue.name}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
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
        this.handleMarkerClick(marker, position);
      });

      // Automatically click the marker if it matches the current venue
      if (parseFloat(venue.lat) === currentLat && parseFloat(venue.lng) === currentLng) {
        this.handleMarkerClick(marker, position);
      }

      this.bounds.extend(marker.position);
    });

    if (venues.length > 0) {
      this.map.fitBounds(this.bounds);
    }
  }

  // Separate the marker click handling into its own function
  handleMarkerClick(marker, position) {
    this.map.setZoom(14);

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
      this.markerClickedValue = true;

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
    // Set flags to false to prevent map from re-centering to venue coordinates
    this.initialLoadValue = false;
    this.markerClickedValue = false;

    // Get the current map center coordinates
    const center = this.map.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    // Update the URL with the new center coordinates and flags
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("latitude", lat);
    newUrl.searchParams.set("longitude", lng);
    newUrl.searchParams.set("initialLoad", this.initialLoadValue);
    newUrl.searchParams.set("markerClicked", this.markerClickedValue);

    // Reload the page with the updated URL
    window.location.href = newUrl.toString();
  }

  animateMapCenter(newCenter) {
    const map = this.map;

    const adjustedNewCenter = {
      lat: newCenter.lat() + 0.003,
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

  initDefaultMap() {
    const mapOptions = {
      center: { lat: -37.8136, lng: 144.9631 },
      zoom: 11,
      disableDefaultUI: true,
      mapId: "8920b6736ae8305a",
    };

    this.map = new google.maps.Map(this.mapDivTarget, mapOptions);
  }

  disconnect() {
    if (this.map && !document.body.contains(this.mapDivTarget)) {
      google.maps.event.clearInstanceListeners(this.map);

      this.initialLoadValue = false;
      this.markerClickedValue = false;
    }
  }
}
