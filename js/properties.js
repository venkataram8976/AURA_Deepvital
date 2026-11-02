document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Upload dialogs
  const opportunityModal = $("#opportunityModal");
  const collaborationModal = $("#collaborationModal");
  const openModal = modal => { if (modal) { modal.style.display = "flex"; document.body.classList.add("modal-open"); } };
  const closeModal = modal => { if (modal) modal.style.display = "none"; if (![opportunityModal, collaborationModal, $("#propertyDetailsModal")].some(m => m && m.style.display === "flex")) document.body.classList.remove("modal-open"); };

  $("#uploadOpportunityBtn")?.addEventListener("click", () => openModal(opportunityModal));
  $("#uploadCollaborationBtn")?.addEventListener("click", () => openModal(collaborationModal));
  $$(".close-modal").forEach(button => button.addEventListener("click", () => {
    closeModal(opportunityModal); closeModal(collaborationModal);
  }));
  [opportunityModal, collaborationModal].forEach(modal => modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal);
  }));

  function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input?.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) { preview.style.display = "none"; return; }
      if (!file.type.startsWith("image/")) { alert("Please choose an image file."); input.value = ""; return; }
      if (file.size > 5 * 1024 * 1024) { alert("Please choose an image smaller than 5 MB."); input.value = ""; return; }
      const reader = new FileReader();
      reader.onload = () => { preview.src = reader.result; preview.style.display = "block"; };
      reader.readAsDataURL(file);
    });
  }
  setupImagePreview("opportunityImage", "opportunityPreview");
  setupImagePreview("collaborationImage", "collaborationPreview");

  // Demo submissions are saved as text-only drafts; no backend is connected.
  function saveDraft(modal, storageKey) {
    const fields = $$("input:not([type='file']):not([type='checkbox']), select, textarea", modal);
    const empty = fields.find(field => !field.value.trim());
    if (empty) { empty.focus(); alert("Please complete all required fields before saving."); return; }
    const values = {};
    fields.forEach((field, index) => values[field.name || field.id || field.placeholder || `field${index + 1}`] = field.value.trim());
    const incubated = $("input[type='checkbox']", modal);
    values.incubated = Boolean(incubated?.checked);
    let drafts = [];
    try { drafts = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (!Array.isArray(drafts)) drafts = []; } catch { drafts = []; }
    drafts.push({ id: Date.now(), savedAt: new Date().toISOString(), ...values });
    try {
      localStorage.setItem(storageKey, JSON.stringify(drafts));
      closeModal(modal);
      alert("Draft saved on this device only. It has not been published or sent to AURA because this GitHub Pages demo has no connected submission server.");
      modal.querySelectorAll("input:not([type='checkbox']), select, textarea").forEach(field => field.value = "");
      modal.querySelectorAll("input[type='checkbox']").forEach(field => field.checked = false);
      modal.querySelectorAll(".image-preview").forEach(image => { image.removeAttribute("src"); image.style.display = "none"; });
    } catch {
      alert("The draft could not be saved. Your browser storage may be full.");
    }
  }
  $$(".modal-actions .btn-primary", opportunityModal || document).filter(button => button !== $("#closePropertyDetailsAction")).forEach(button =>
    button.addEventListener("click", () => saveDraft(opportunityModal, "aura_franchise_submissions")));
  $$(".modal-actions .btn-primary", collaborationModal || document).forEach(button =>
    button.addEventListener("click", () => saveDraft(collaborationModal, "aura_collaboration_submissions")));

  // Filters: keyword, city and category work independently and together.
  function normal(value) { return (value || "").toLowerCase().trim(); }
  function setupFilters(config) {
    const cards = $$(config.cardSelector);
    const keyword = document.getElementById(config.keywordId);
    const city = document.getElementById(config.cityId);
    const category = document.getElementById(config.categoryId);
    const budget = config.budgetId ? document.getElementById(config.budgetId) : null;
    const result = document.getElementById(config.resultId);
    const apply = () => {
      const q = normal(keyword?.value);
      const c = normal(city?.value);
      const cat = normal(category?.value);
      const b = normal(budget?.value);
      let visible = 0;
      cards.forEach(card => {
        const text = normal(card.textContent);
        const name = normal(card.dataset.name);
        const cardCategory = normal(card.dataset.category);
        const cardCity = normal(card.dataset.city);
        const amount = Number(card.dataset.investment || 0);
        const matches = (!q || text.includes(q) || name.includes(q) || cardCategory.includes(q)) &&
          (!c || cardCity === c) &&
          (!cat || cardCategory.includes(cat)) &&
          (!b || (b === "under20" && amount < 20) || (b === "20to30" && amount >= 20 && amount <= 30) || (b === "above30" && amount > 30));
        card.hidden = !matches;
        if (matches) visible++;
      });
      if (result) result.textContent = `Showing ${visible} of ${cards.length} ${config.label}`;
    };
    [keyword, city, category, budget].filter(Boolean).forEach(field => {
      field.addEventListener("input", apply);
      field.addEventListener("change", apply);
    });
    document.getElementById(config.searchId)?.addEventListener("click", apply);
    document.getElementById(config.resetId)?.addEventListener("click", () => {
      [keyword, city, category, budget].filter(Boolean).forEach(field => field.value = "");
      apply();
    });
    apply();
  }

  setupFilters({ cardSelector: ".franchise-card", keywordId: "franchiseKeyword", cityId: "franchiseLocation", categoryId: "franchiseCategory", budgetId: "franchiseInvestment", resultId: "franchiseResults", searchId: "franchiseSearchBtn", resetId: "franchiseResetBtn", label: "franchise opportunities" });
  setupFilters({ cardSelector: ".collaboration-card", keywordId: "collabKeyword", cityId: "collabLocation", categoryId: "collabCategory", resultId: "collabResults", searchId: "collabSearchBtn", resetId: "collabResetBtn", label: "collaboration proposals" });

  // Property and collaboration detail views.
  const detailsModal = $("#propertyDetailsModal");
  const detailMap = [
    { selector: ".franchise-card", type: "Franchise opportunity", descriptions: ["A café franchise concept with dine-in and takeaway potential. Suitable for operators looking to enter food and beverage.", "A fitness franchise model with a membership-led business format.", "A retail convenience store concept with an area-level franchise structure."] },
    { selector: ".collaboration-card", type: "Collaboration proposal", descriptions: ["A delivery-focused cloud kitchen seeking an investor and operations partner.", "An electric mobility dealership proposal seeking a strategic partner.", "A healthcare clinic concept seeking medical and investment partners."] }
  ];
  detailMap.forEach(group => $$(group.selector).forEach((card, index) => {
    const button = $("button", card);
    if (!button) return;
    button.type = "button";
    button.addEventListener("click", () => {
      $("#propertyDetailsType").textContent = group.type;
      $("#propertyDetailsTitle").textContent = $("h3", card)?.textContent || group.type;
      const body = $("#propertyDetailsBody");
      body.replaceChildren();
      const image = $("img", card);
      if (image) { const copy = image.cloneNode(); copy.className = "property-detail-image"; body.append(copy); }
      const description = document.createElement("p");
      description.textContent = group.descriptions[index] || "Explore this opportunity and contact the owner for verified details.";
      const info = document.createElement("div");
      info.className = "detail-list";
      $$("p", card).forEach(p => { const line = document.createElement("p"); line.textContent = p.textContent; info.append(line); });
      const note = document.createElement("p");
      note.className = "detail-note";
      note.textContent = "This is illustrative listing information. Verify financials, legal terms and availability directly with the opportunity owner before making a decision.";
      body.append(description, info, note);
      openModal(detailsModal);
    });
  }));
  const closeDetails = () => closeModal(detailsModal);
  $("#closePropertyDetails")?.addEventListener("click", closeDetails);
  $("#closePropertyDetailsAction")?.addEventListener("click", closeDetails);
  detailsModal?.addEventListener("click", event => { if (event.target === detailsModal) closeDetails(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") [opportunityModal, collaborationModal, detailsModal].forEach(closeModal);
  });
});
