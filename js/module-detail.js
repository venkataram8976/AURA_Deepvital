document.addEventListener("DOMContentLoaded", () => {

  /* ================= MODULE HEADING LOGIC ================= */

  const moduleTitleEl = document.getElementById("moduleTitle");

  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get("module") || "1";

  const moduleTitles = {
    "1": "AURA Foundations",
    "2": "Rewards to Long-Term Value",
    "3": "Opportunities & Collaboration"
  };

  if (moduleTitleEl) {
    moduleTitleEl.textContent = moduleTitles[moduleId] || "Module";
  }

  /* ================= TOPIC SWITCHING LOGIC ================= */

  const topicLinks = document.querySelectorAll(".module-topic-list li");
  const topicContents = document.querySelectorAll(".topic-content");

  function showTopic(topicId) {
    // Hide all topic contents
    topicContents.forEach(content => {
      content.classList.remove("active");
      content.style.display = "none";
    });

    // Remove active state from all headings
    topicLinks.forEach(link => {
      link.classList.remove("active");
    });

    // Show selected topic content
    const activeContent = document.getElementById(topicId);
    if (activeContent) {
      activeContent.classList.add("active");
      activeContent.style.display = "block";
    }

    // Highlight active topic heading
    const activeLink = document.querySelector(
      `.module-topic-list li[data-topic="${topicId}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Attach click listeners
  topicLinks.forEach(link => {
    link.addEventListener("click", () => {
      const topicId = link.dataset.topic;
      showTopic(topicId);
    });
  });

  // Show ONLY first topic by default
  if (topicLinks.length > 0) {
    showTopic(topicLinks[0].dataset.topic);
  }

});
