/* ================= STORAGE (SINGLE SOURCE OF TRUTH) ================= */

// rewards history
let rewards = JSON.parse(localStorage.getItem("aura_rewards")) || [];

// total points (shared with app.js)
function getTotalPoints() {
  return rewards.reduce((sum, r) => sum + r.points, 0);
}

function syncTotalPoints(total) {
  localStorage.setItem("aura_rewards", JSON.stringify(rewards));
  localStorage.setItem("auraRewardPoints", total); // 🔗 sync with app.js
}

/* ================= DOM ================= */

const totalPointsEl = document.getElementById("totalPoints");
const historyEl = document.getElementById("rewardHistory");
const earnBtn = document.getElementById("earnPointsBtn");
const calculatorPoints = document.getElementById("calculatorPoints");

/* ================= ECONOMIC CONFIG ================= */

const POINT_TO_REVENUE = 1.25;
const COMPANY_VALUATION = 500_000_000;      // ₹5 Cr
const CIRCULATING_COINS = 1_000_000;
const DAILY_REVENUE_AFTER_PAYOUT = 250_000;

/* ================= RENDER ================= */

function renderRewards() {
  if (!historyEl || !totalPointsEl) return;

  historyEl.innerHTML = "";

  rewards.forEach(r => {
    historyEl.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.activity}</td>
        <td>+${r.points}</td>
      </tr>
    `;
  });

  const total = getTotalPoints();
  totalPointsEl.textContent = total;

  syncTotalPoints(total);

  if (calculatorPoints) {
    calculatorPoints.value = total;
    updateCalculator();
  }

  updateCharts(total);
}

/* ================= EARN POINTS ================= */

if (earnBtn) {
  earnBtn.addEventListener("click", () => {
    rewards.push({
      date: new Date().toISOString().split("T")[0],
      activity: "Platform Engagement",
      points: 100
    });
    renderRewards();
  });
}

/* ================= CALCULATOR ================= */

const inrValue = document.getElementById("inrValue");
const cryptoResult = document.getElementById("cryptoResult");
const pointRateEl = document.getElementById("pointRate");

function updateCalculator() {
  if (!calculatorPoints || !inrValue || !cryptoResult) return;

  const points = Number(calculatorPoints.value || 0);

  const revenueGivenToUser = points * POINT_TO_REVENUE;
  inrValue.value = "₹ " + revenueGivenToUser.toLocaleString("en-IN");
  pointRateEl.textContent = POINT_TO_REVENUE;

  const coinValue =
    (DAILY_REVENUE_AFTER_PAYOUT + COMPANY_VALUATION) / CIRCULATING_COINS;

  const coinsGenerated = revenueGivenToUser / coinValue;
  cryptoResult.textContent = coinsGenerated.toFixed(6) + " AURA";
}

calculatorPoints?.addEventListener("input", updateCalculator);

/* ================= CHART DATA ================= */

function generateTrend(base, growth, length) {
  return Array.from({ length }, (_, i) =>
    Number((base + i * growth).toFixed(2))
  );
}

const dayData = [10.2, 10.4, 10.35, 10.6, 10.9, 11.1, 11.3];
const weekData = generateTrend(9.5, 0.3, 7);
const monthData = generateTrend(8, 0.12, 30);
const sixMonthData = generateTrend(7, 0.06, 180);
const yearData = generateTrend(6.5, 0.03, 365);
const fiveYearData = generateTrend(5, 0.25, 60);

/* ================= DAY CHART ================= */

const dayChartEl = document.getElementById("dayChart");
const rangeChartEl = document.getElementById("rangeChart");

let dayChart, rangeChart;

if (dayChartEl && typeof window.Chart === "function") {
  dayChart = new Chart(dayChartEl, {
    type: "line",
    data: {
      labels: ["9AM","10AM","11AM","12PM","1PM","2PM","3PM"],
      datasets: [{
        data: dayData,
        borderColor: "#4f46e5",
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: v => "₹" + v } } }
    }
  });
}

/* ================= RANGE CHART ================= */

if (rangeChartEl && typeof window.Chart === "function") {
  rangeChart = new Chart(rangeChartEl, {
    type: "line",
    data: {
      labels: weekData.map((_, i) => `Day ${i + 1}`),
      datasets: [{
        data: weekData,
        borderColor: "#16a34a",
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: v => "₹" + v } } }
    }
  });
}

/* ================= CHART SYNC ================= */

function updateCharts(totalPoints) {
  if (!rangeChart) return;

  const multiplier = 1 + totalPoints / 10000;

  const base = weekData;
  rangeChart.data.datasets[0].data = base.map(v =>
    Number((v * multiplier).toFixed(2))
  );

  rangeChart.update();
}

/* ================= RANGE SWITCHER ================= */

document.getElementById("rangeSelector")?.addEventListener("change", e => {
  if (!rangeChart) return;

  const value = e.target.value;
  let data, labelPrefix;

  switch (value) {
    case "7": data = weekData; labelPrefix = "Day"; break;
    case "30": data = monthData; labelPrefix = "Day"; break;
    case "180": data = sixMonthData; labelPrefix = "Day"; break;
    case "365": data = yearData; labelPrefix = "Day"; break;
    case "1825": data = fiveYearData; labelPrefix = "Month"; break;
    default: data = weekData; labelPrefix = "Day";
  }

  rangeChart.data.labels = data.map((_, i) => `${labelPrefix} ${i + 1}`);
  rangeChart.data.datasets[0].data = data;
  rangeChart.update();
});

/* ================= INIT ================= */

renderRewards();
updateCalculator();
