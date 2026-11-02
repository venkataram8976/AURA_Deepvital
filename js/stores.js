document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const storeType = params.get("type");
  const container = document.getElementById("storesList");
  const locationButton = document.getElementById("allowLocationBtn");
  const retryButton = document.getElementById("retryLocationBtn");
  const citySelect = document.getElementById("manualCity");
  const cityButton = document.getElementById("manualCityBtn");
  const status = document.getElementById("locationStatus");

  // Sample AURA partner directory. Distances are calculated from the user's
  // browser coordinates; the store coordinates below are demo listing data.
  const storesData = {
    shopping: [
      { id: 1, name: "Urban Fashion Store", address: "Banjara Hills, Hyderabad", city: "Hyderabad", lat: 17.4065, lng: 78.4772, reward: "10 pts / ₹100" },
      { id: 5, name: "QuickMart Express", address: "Anna Nagar, Chennai", city: "Chennai", lat: 13.0850, lng: 80.2101, reward: "10 pts / ₹100" }
    ],
    food: [{ id: 2, name: "Urban Brew Café", address: "Jubilee Hills, Hyderabad", city: "Hyderabad", lat: 17.4326, lng: 78.4071, reward: "10 pts / ₹100" }],
    services: [{ id: 3, name: "FitZone Gym", address: "Indiranagar, Bengaluru", city: "Bengaluru", lat: 12.9784, lng: 77.6408, reward: "15 pts / ₹100" }],
    travel: [{ id: 4, name: "AURA Travel Partner", address: "Hitech City, Hyderabad", city: "Hyderabad", lat: 17.4483, lng: 78.3915, reward: "20 pts / ₹100" }]
  };

  const rad = value => value * Math.PI / 180;
  const getDistanceKm = (a, b, c, d) => {
    const x = Math.sin(rad(c - a) / 2) ** 2 +
      Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  function getStores() {
    return storeType && storesData[storeType] ? storesData[storeType] : Object.values(storesData).flat();
  }

  function renderStores(userCoords = null, cityFilter = "") {
    if (!container) return;
    let stores = getStores().filter(store => !cityFilter || store.city.toLowerCase() === cityFilter.toLowerCase());
    if (userCoords) {
      stores = stores.map(store => ({
        ...store,
        distance: getDistanceKm(userCoords.latitude, userCoords.longitude, store.lat, store.lng)
      })).sort((a, b) => a.distance - b.distance);
    }
    container.replaceChildren();
    if (!stores.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No sample partner listings are available for this city and category yet. Try another city or browse all listed stores.";
      container.append(empty);
      return;
    }
    stores.forEach(store => {
      const card = document.createElement("article");
      card.className = "card store-card";
      const heading = document.createElement("h3");
      heading.textContent = store.name;
      const address = document.createElement("p");
      address.textContent = `Address: ${store.address}`;
      const reward = document.createElement("p");
      reward.textContent = `Rewards: ${store.reward}`;
      const distance = document.createElement("p");
      distance.textContent = userCoords
        ? `Distance: ${store.distance.toFixed(2)} km (straight-line estimate)`
        : "Distance not calculated — enable location to calculate proximity.";
      const link = document.createElement("a");
      link.className = "btn-outline";
      const type = storeType || Object.keys(storesData).find(key => storesData[key].some(item => item.id === store.id));
      link.href = `store-details.html?id=${store.id}&type=${type}`;
      link.textContent = "View Store";
      card.append(heading, address, reward, distance, link);
      container.append(card);
    });
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("This browser does not support geolocation. Use the city selector to browse listed stores.");
      renderStores();
      return;
    }
    setStatus("Requesting your location… Please respond to the browser permission prompt.");
    if (locationButton) { locationButton.disabled = true; locationButton.textContent = "Locating…"; }
    navigator.geolocation.getCurrentPosition(position => {
      const coords = position.coords;
      renderStores({ latitude: coords.latitude, longitude: coords.longitude });
      const accuracy = Math.round(coords.accuracy);
      setStatus(`Location found. Browser-reported accuracy: approximately ${accuracy} metres. Distances are straight-line estimates, not driving routes.`);
      if (locationButton) { locationButton.disabled = false; locationButton.textContent = "Refresh Location"; }
    }, error => {
      const messages = {
        1: "Location permission was denied. In Chrome, select the site icon beside the address → Site settings → Location → Allow, then press Retry location.",
        2: "Your device could not determine a location. Turn on device location services or use the city selector.",
        3: "Location request timed out. Try again in a moment, or browse by city."
      };
      setStatus(messages[error.code] || "Location could not be determined. You can browse by city instead.");
      if (locationButton) { locationButton.disabled = false; locationButton.textContent = "Allow Location"; }
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000
    });
  }

  renderStores();
  locationButton?.addEventListener("click", requestLocation);
  retryButton?.addEventListener("click", requestLocation);
  cityButton?.addEventListener("click", () => {
    const city = citySelect?.value || "";
    renderStores(null, city);
    setStatus(city ? `Showing available sample listings in ${city}. Allow location to calculate distances.` : "Showing all sample partner listings. Allow location to calculate distances.");
  });
});
