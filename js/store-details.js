document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const storeId = Number(params.get("id"));
  const storeType = params.get("type");

  const storesData = {
    shopping: [{ id: 1, name: "Urban Fashion Store", address: "Banjara Hills, Hyderabad", lat: 17.4065, lng: 78.4772 }],
    food: [{ id: 2, name: "Urban Brew Café", address: "Jubilee Hills, Hyderabad", lat: 17.4326, lng: 78.4071 }],
    services: [{ id: 3, name: "FitZone Gym", address: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489 }],
    travel: [{ id: 4, name: "AURA Travel Partner", address: "Hitech City, Hyderabad", lat: 17.4483, lng: 78.3915 }]
  };

  const store = (storesData[storeType] || []).find(item => item.id === storeId);
  const nameEl = document.getElementById("storeName");
  const addressEl = document.getElementById("storeAddress");
  const distanceEl = document.getElementById("storeDistance");
  const mapLink = document.getElementById("mapLink");
  const uberLink = document.getElementById("uberLink");
  const qrCanvas = document.getElementById("qrCode");
  const simulateButton = document.getElementById("simulateScan");

  if (!store) {
    if (nameEl) nameEl.textContent = "Store not found";
    if (addressEl) addressEl.textContent = "Please return to partner stores and select a valid store.";
    if (distanceEl) distanceEl.textContent = "";
    if (simulateButton) simulateButton.disabled = true;
    return;
  }

  if (nameEl) nameEl.textContent = store.name;
  if (addressEl) addressEl.textContent = store.address;
  if (mapLink) {
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
    mapLink.rel = "noopener noreferrer";
  }
  if (uberLink) {
    uberLink.href = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${store.lat}&dropoff[longitude]=${store.lng}`;
    uberLink.rel = "noopener noreferrer";
  }

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const rad = value => value * Math.PI / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      if (distanceEl) distanceEl.textContent =
        `Distance: ${distanceKm(latitude, longitude, store.lat, store.lng).toFixed(2)} km`;
      if (mapLink) mapLink.href =
        `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${store.lat},${store.lng}`;
      if (uberLink) uberLink.href =
        `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${store.lat}&dropoff[longitude]=${store.lng}`;
    }, () => {
      if (distanceEl) distanceEl.textContent = "Enable location to calculate distance.";
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
  } else if (distanceEl) {
    distanceEl.textContent = "Location is not supported by this browser.";
  }

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("aura_user") || "null"); }
    catch { return null; }
  })();
  const payload = `AURA|${user?.email || "GUEST"}|${store.id}|${Date.now()}`;

  if (qrCanvas && typeof window.QRious === "function") {
    new window.QRious({ element: qrCanvas, size: 180, value: payload });
  } else if (qrCanvas) {
    const context = qrCanvas.getContext("2d");
    context.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    if (distanceEl) distanceEl.textContent += " QR preview is unavailable while the QR library is offline.";
  }

  simulateButton?.addEventListener("click", () => {
    const current = Number(localStorage.getItem("auraRewardPoints") || 0);
    const updated = current + 100;
    localStorage.setItem("auraRewardPoints", String(updated));
    alert("Demo scan complete: 100 points added to this browser.");
  });
});
