document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn-tab");
  const sections = document.querySelectorAll(".container .row-cols-2");

  const mapping = {
    "Cordero": 0,
    "Res": 1,
    "Procesados": 2,
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const label = button.textContent.trim();
      const targetIndex = mapping[label];

      sections.forEach((section, index) => {
        if (index === targetIndex) {
          section.classList.remove("hidden", "fade-out");
          section.classList.add("fade-in");
        } else {
          section.classList.remove("fade-in");
          section.classList.add("fade-out");
          setTimeout(() => {
            section.classList.add("hidden");
          }, 400);
        }
      });
    });
  });

  // ------------------------------------------
  // Mostrar productos desde localStorage
  class ItemsController {
    constructor() {
      this.items = [];
      this.currentId = 0;
    }

    loadItemsFromLocalStorage() {
      const storageItems = localStorage.getItem("items");
      const storedId = localStorage.getItem("currentId");

      if (storageItems) {
        this.items = JSON.parse(storageItems);
      }

      if (storedId) {
        this.currentId = parseInt(storedId);
      }
    }
  }

  function renderItems(items) {
    const container = document.getElementById("localStorageProductsContainer");
    if (!container) return;

    container.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("col");
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-duration", (200 + index * 200).toString());

      card.innerHTML = `
        <div class="product-card d-flex flex-column align-items-center text-center h-100 p-3 border rounded-4 shadow">
          <img src="assets/productos/${item.imagen}" alt="${item.nombre}" class="img-fluid mb-2">
          <p class="titleProduct">${item.nombre} 
            <i class="fa-regular fa-file fa-xl" role="button" data-bs-toggle="modal" data-bs-target="#modal"></i>
          </p>
          <p class="describe">${item.descripcion}</p>
          <div class="mt-auto">
            <span class="d-block mb-2 fw-bold">$${parseFloat(item.precio).toFixed(2)}</span>
            <button class="btn btn-danger">Comprar</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Reiniciar AOS para nuevas tarjetas
    AOS.init();
  }

  const controller = new ItemsController();
  controller.loadItemsFromLocalStorage();
  renderItems(controller.items);
});
