document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;

  if (hash) {
    const item = document.querySelector(hash);

    if (item && item.classList.contains("accordion-item")) {
      // Simula clic en el encabezado para abrir el acordeón
      const summary = item.querySelector(".accordion-header");
      if (summary) {
        summary.click();
        // Scroll hasta la sección
        item.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
});
