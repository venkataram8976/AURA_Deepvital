/* ================= LIVE SESSIONS DATA ================= */

const sessions = {
  "2026-01-20": {
    title: "Building Scalable Brands",
    speaker: "Startup Growth Mentor",
    role: "Founder & Growth Strategist",
    time: "7:00 – 8:00 PM IST",
    format: "Live Talk + Q&A",
    audience: "Early-stage founders and brand owners",
    learnings: [
      "How to scale brands with limited capital",
      "Common growth mistakes to avoid",
      "Building sustainable business models"
    ],
    link: "#"
  },
  "2026-01-28": {
    title: "Legal Essentials for Founders",
    speaker: "Legal Compliance Expert",
    role: "Startup Legal Advisor",
    time: "6:30 – 7:30 PM IST",
    format: "Expert Talk",
    audience: "Founders and early startup teams",
    learnings: [
      "Key legal requirements for startups",
      "Contracts and compliance basics",
      "Avoiding common legal risks"
    ],
    link: "#"
  },
  "2026-01-05": {
    title: "Funding & Financial Planning",
    speaker: "Finance Advisor",
    role: "Startup Finance Consultant",
    time: "7:00 – 8:00 PM IST",
    format: "Workshop",
    audience: "Startup founders & finance teams",
    learnings: [
      "Understanding funding stages",
      "Financial planning for growth",
      "Managing cash flow effectively"
    ],
    link: "#"
  }
};

/* ================= DATE & STATUS ================= */

function getTodayKey() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .split("T")[0];
}

function getSessionStatus(dateKey) {
  const today = new Date(getTodayKey());
  const sessionDate = new Date(dateKey);

  if (sessionDate.getTime() === today.getTime()) return "live";
  if (sessionDate < today) return "completed";
  return "upcoming";
}

/* ================= CALENDAR STATE ================= */

let currentDate = new Date();

const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");
const sessionDetails = document.getElementById("sessionDetails");

/* ================= CLEAR DETAILS ================= */

function clearSessionDetails() {
  if (!sessionDetails) return;

  sessionDetails.innerHTML = `
    <div class="empty-state">
      <p>No session scheduled for this date.</p>
    </div>
  `;
}

/* ================= CALENDAR RENDER ================= */

function renderCalendar() {
  if (!calendarGrid || !monthYear) return;

  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayKey = getTodayKey();

  monthYear.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDiv = document.createElement("div");

    dayDiv.className = "calendar-day";
    dayDiv.textContent = day;

    if (dateKey === todayKey) {
      dayDiv.classList.add("today");
    }

    if (sessions[dateKey]) {
      const status = getSessionStatus(dateKey);
      dayDiv.classList.add("has-session");

      if (status === "live") {
        dayDiv.classList.add("live-today");
      }

      dayDiv.onclick = () => showSession(dateKey);
    } else {
      // ✅ CLEAR INFO when clicking empty date
      dayDiv.classList.add("no-session");
      dayDiv.onclick = clearSessionDetails;
    }

    calendarGrid.appendChild(dayDiv);
  }
}

/* ================= SESSION DETAILS ================= */

function showSession(dateKey) {
  if (!sessions[dateKey] || !sessionDetails) return;

  const session = sessions[dateKey];
  const status = getSessionStatus(dateKey);

  const statusText =
    status === "live"
      ? "🔴 Live Now"
      : status === "upcoming"
      ? "⏳ Upcoming"
      : "✅ Completed";

  sessionDetails.innerHTML = `
    <h3>${session.title}</h3>

    <p><strong>Speaker:</strong> ${session.speaker}</p>
    <p><strong>Role:</strong> ${session.role}</p>
    <p><strong>Date & Time:</strong> ${dateKey} · ${session.time}</p>
    <p><strong>Format:</strong> ${session.format}</p>
    <p><strong>Who should attend:</strong> ${session.audience}</p>

    <p><strong>What you’ll learn:</strong></p>
    <ul>
      ${session.learnings.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <p><strong>Status:</strong> ${statusText}</p>

    ${
      status === "live"
        ? `<a href="${session.link}" class="btn-primary join-live">Join Live</a>`
        : ""
    }
  `;
}

/* ================= NAVIGATION ================= */

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

if (prevBtn) {
  prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    clearSessionDetails();
  };
}

if (nextBtn) {
  nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    clearSessionDetails();
  };
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  clearSessionDetails();
});
