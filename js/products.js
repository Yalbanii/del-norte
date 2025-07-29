document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn-tab");
  const sections = {
    cordero: document.getElementById("productos-cordero"),
    res: document.getElementById("productos-res"),
    procesados: document.getElementById("productos-procesados"),
  };

  const modalCantidadEl = document.getElementById('modal-cantidad-producto');
  const modalCantidadNombre = document.getElementById('cantidad-producto-nombre');
  const modalCantidadInput = document.getElementById('cantidad-producto-input');
  const modalCantidadStock = document.getElementById('cantidad-producto-stock');
  const modalCantidadConfirmar = document.getElementById('cantidad-producto-confirmar');
  const modalCantidad = modalCantidadEl ? new bootstrap.Modal(modalCantidadEl) : null;

  const modalFichaEl = document.getElementById('modal-ficha');
  const modalFicha = modalFichaEl ? new bootstrap.Modal(modalFichaEl) : null;
  const fichaFrame = modalFichaEl ? document.getElementById('ficha-frame') : null;
  const fichaNoDisponible = modalFichaEl ? document.getElementById('ficha-no-disponible') : null;
  let productoSeleccionado = null;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category.toLowerCase();

      Object.entries(sections).forEach(([key, section]) => {
        if (key === category) {
          section.classList.remove("hidden", "fade-out");
          section.classList.add("fade-in");

          setTimeout(() => {
            AOS.refresh();
          }, 200);
        } else {
          section.classList.remove("fade-in");
          section.classList.add("fade-out");
          setTimeout(() => {
            section.classList.add("hidden");
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------
  // Cargar productos desde la API y mostrarlos por categoría
  function renderItems(items, container) {
    if (!container) return;
    container.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("col");
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-duration", (200 + index * 200).toString());

      const lowStock = item.stock <= 10 && item.stock > 0;
      const soldOut = item.stock <= 0;
      const stockMsg = soldOut
        ? '<p class="stock-msg text-danger fw-bold">Producto agotado</p>'
        : lowStock
          ? '<p class="stock-msg text-warning fw-bold">\u00A1Quedan pocas unidades!</p>'
          : '';
      const buyBtn = soldOut
        ? '<span class="text-muted">Agotado</span>'
        : `<button class="btn btn-danger add-cart" data-id="${item.id}" data-nombre="${item.nombre}" data-precio="${item.precio}" data-imagen="${item.urlImagen}" data-desc="${item.descripcion}">Comprar</button>`;

      card.innerHTML = `
        <div class="product-card d-flex flex-column align-items-center text-center h-100 p-3 border rounded-4 shadow ${soldOut ? 'sold-out' : ''}">
          <img src="${item.urlImagen}" alt="${item.nombre}" class="img-fluid mb-2">
          <p class="titleProduct mb-2">${item.nombre}</p>
          <button type="button" class="btn ficha-btn mb-2" data-ficha="${item.urlFichaTecnica}">Ficha técnica</button>
          <p class="describe">${item.descripcion}</p>
          <p class="mb-1">Peso: ${item.pesoMinimo} - ${item.pesoMaximo} kg</p>
          ${stockMsg}
          <div class="mt-auto">
            <span class="d-block mb-2 fw-bold">$${parseFloat(item.precio).toFixed(2)}</span>
            ${buyBtn}
          </div>
        </div>`;

      container.appendChild(card);
      const addCartBtn = card.querySelector('.add-cart');
      if(addCartBtn){
        addCartBtn.addEventListener('click', () => {
          if(!modalCantidad) return;
          productoSeleccionado = item;
          const cart = CartUtils.getCart();
          const existente = cart.find(it => it.id === item.id);
          const max = item.stock - (existente ? existente.cantidad : 0);
        if(max <= 0){
          alert('No hay suficiente stock disponible.');
          return;
        }
        modalCantidadNombre.textContent = item.nombre;
        modalCantidadInput.value = 1;
        modalCantidadInput.max = max;
          modalCantidadStock.textContent = `Disponible: ${max}`;
          modalCantidad.show();
        });
      }

      const fichaBtn = card.querySelector('.ficha-btn');
      fichaBtn.addEventListener('click', () => {
        if(!modalFicha) return;
        const url = fichaBtn.getAttribute('data-ficha');
        if(url){
          fichaFrame.src = url;
          fichaFrame.classList.remove('d-none');
          fichaNoDisponible.classList.add('d-none');
        } else {
          fichaFrame.src = '';
          fichaFrame.classList.add('d-none');
          fichaNoDisponible.classList.remove('d-none');
        }
        modalFicha.show();
      });
    });

    AOS.init();
  }

  function getCategoryKey(id) {
    switch (id) {
      case 1:
        return "cordero";
      case 2:
        return "res";
      case 3:
        return "procesados";
      default:
        return null;
    }
  }

  fetch(`${API_BASE_URL}/api/productos`)
    .then((res) => res.json())
    .then((productos) => {
      const grouped = { cordero: [], res: [], procesados: [] };

      productos.forEach((prod) => {
        const key = getCategoryKey(prod.categoriaId);
        if (key && grouped[key]) {
          grouped[key].push(prod);
        }
      });

      renderItems(grouped.cordero, sections.cordero);
      renderItems(grouped.res, sections.res);
      renderItems(grouped.procesados, sections.procesados);
    })
    .catch((err) => console.error(err));

  modalCantidadConfirmar?.addEventListener('click', () => {
    if(!productoSeleccionado) return;
    const cantidad = parseInt(modalCantidadInput.value);
    const max = parseInt(modalCantidadInput.max);
    if(isNaN(cantidad) || cantidad < 1) return;
    if(cantidad > max){
      alert('La cantidad supera el stock disponible');
      return;
    }
    CartUtils.addItem({
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      precio: parseFloat(productoSeleccionado.precio),
      imagen: productoSeleccionado.urlImagen,
      descripcion: productoSeleccionado.descripcion,
      stock: productoSeleccionado.stock,
      pesoMinimo: productoSeleccionado.pesoMinimo,
      pesoMaximo: productoSeleccionado.pesoMaximo
    }, cantidad);
    updateCartBadge();
    modalCantidad.hide();
  });
});
