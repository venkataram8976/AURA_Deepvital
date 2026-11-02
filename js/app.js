// ================= GLOBAL REWARD STATE =================

// Initialize rewards if not present
if (!localStorage.getItem("auraRewardPoints")) {
  localStorage.setItem("auraRewardPoints", "0");
}

// Get rewards
function getRewardPoints() {
  return Number(localStorage.getItem("auraRewardPoints"));
}

// Add rewards
function addRewardPoints(points) {
  const current = getRewardPoints();
  const updated = current + points;
  localStorage.setItem("auraRewardPoints", updated);
  return updated;
}

/* ================= Franchise Recommendations ================= */

const franchiseRecommendations = [
  { id: 1, type: "Franchise", title: "FitZone Gym", location: "Bengaluru", investment: "₹30L – ₹40L", image: "assets/gym.jpg", description: "A fitness-centre franchise concept focused on strength training, group fitness and member wellness.", opportunity: "Master Franchise", benefits: "Brand-led operating model, membership revenue potential and local marketing support." },
  { id: 2, type: "Franchise", title: "Urban Brew Café", location: "Hyderabad", investment: "₹15L – ₹25L", image: "assets/cafe.jpg", description: "A contemporary café concept for food and beverage entrepreneurs, with dine-in and takeaway potential.", opportunity: "Single Unit", benefits: "A compact café format, menu-led customer experience and local partnership opportunities." },
  { id: 3, type: "Collaboration", title: "South India Cloud Kitchen", location: "Bengaluru", investment: "₹12L", image: "assets/cloud-kitchen.jpg", description: "A delivery-first kitchen concept seeking an operating and investment partner.", opportunity: "Investor + Operations Partner", benefits: "Shared operating responsibilities and an opportunity to build a local food brand." }
];

function openRecommendationDetails(item) {
  const modal = document.getElementById("recommendationModal");
  if (!modal) return;
  document.getElementById("recommendationType").textContent = item.type;
  document.getElementById("recommendationModalTitle").textContent = item.title;
  document.getElementById("recommendationDescription").textContent = item.description;
  document.getElementById("recommendationLocation").textContent = item.location;
  document.getElementById("recommendationInvestment").textContent = item.investment;
  document.getElementById("recommendationOpportunity").textContent = item.opportunity;
  document.getElementById("recommendationBenefits").textContent = item.benefits;
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeRecommendationDetails() {
  const modal = document.getElementById("recommendationModal");
  if (modal) modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function renderFranchiseRecommendations() {
  const list = document.getElementById("recommendationsList");
  if (!list) return;
  list.replaceChildren();
  franchiseRecommendations.forEach(item => {
    const card = document.createElement("article");
    card.className = "card recommendation-card";
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;
    const content = document.createElement("div");
    content.className = "recommendation-content";
    const tag = document.createElement("span");
    tag.className = "recommendation-tag";
    tag.textContent = item.type;
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const location = document.createElement("p");
    location.className = "recommendation-meta";
    location.textContent = `Location: ${item.location}`;
    const investment = document.createElement("p");
    investment.className = "recommendation-meta";
    investment.textContent = `Investment: ${item.investment}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn-outline";
    button.textContent = "View Details";
    button.addEventListener("click", () => openRecommendationDetails(item));
    content.append(tag, heading, location, investment, button);
    card.append(image, content);
    list.append(card);
  });
}

/* ================= Rewards → Crypto ================= */

function renderRewardsCrypto() {
  const rewardPoints = getRewardPoints();

  const rewardEl = document.getElementById("rewardPoints");
  const cryptoEl = document.getElementById("cryptoValue");
  const fiatEl = document.getElementById("fiatValue");
  const lockedEl = document.getElementById("cryptoLocked");
  const unlockedEl = document.getElementById("cryptoUnlocked");

  if (rewardEl) {
    rewardEl.textContent = `${rewardPoints} pts`;
  }

  const INR_PER_POINT = 1;
  const BTC_RATE = 4200000;

  if (rewardPoints > 0 && cryptoEl && fiatEl) {
    const inrValue = rewardPoints * INR_PER_POINT;
    const btcValue = inrValue / BTC_RATE;

    if (lockedEl) lockedEl.style.display = "none";
    if (unlockedEl) unlockedEl.style.display = "block";

    fiatEl.textContent = `≈ ₹${inrValue.toLocaleString()}`;
    cryptoEl.textContent = `${btcValue.toFixed(6)} BTC`;
  } else {
    if (lockedEl) lockedEl.style.display = "block";
    if (unlockedEl) unlockedEl.style.display = "none";
  }
}

/* ================= NAV TOGGLE ================= */

function initNavToggle() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    navToggle.classList.toggle("active");
  });
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  renderFranchiseRecommendations();
  renderRewardsCrypto();
  initNavToggle();
  updateAuthUI();
  document.getElementById("closeRecommendationModal")?.addEventListener("click", closeRecommendationDetails);
  document.getElementById("closeRecommendationAction")?.addEventListener("click", closeRecommendationDetails);
  document.getElementById("recommendationModal")?.addEventListener("click", event => {
    if (event.target.id === "recommendationModal") closeRecommendationDetails();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeRecommendationDetails();
  });
});


/* ================= AUTH UI ================= */
function updateAuthUI() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("aura_user") || "null");
  } catch {
    user = null;
  }

  const loginLink = document.getElementById("loginLink");
  const profileLink = document.getElementById("profileLink");
  if (loginLink) loginLink.style.display = user ? "none" : "";
  if (profileLink) profileLink.style.display = user ? "" : "none";

  const profileHeading = document.querySelector(".profile-header h2");
  const profileEmail = document.querySelector(".profile-header p");
  if (profileHeading) profileHeading.textContent = user?.name || "Guest User";
  if (profileEmail) profileEmail.textContent = user?.email || "No account is currently signed in";
  const profileName = document.getElementById("profileName");
  if (profileName) profileName.textContent = user?.name || "Guest User";
  const profilePoints = document.getElementById("profileRewardPoints");
  if (profilePoints) profilePoints.textContent = String(getRewardPoints());

  const avatar = document.getElementById("headerProfileAvatar");
  if (avatar) avatar.alt = user ? `Profile for ${user.name}` : "Profile";
}

