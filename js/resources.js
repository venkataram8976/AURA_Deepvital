// Resource category navigation

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".resource-category .card");

  cards.forEach(card => {
    const link = card.closest("a");

    if (!link) return;

    // Keyboard accessibility
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () => {
      window.location.href = link.getAttribute("href");
    });

    card.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        window.location.href = link.getAttribute("href");
      }
    });
  });
});
