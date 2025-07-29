'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const envioEl = document.getElementById('cart-envio');
  const totalEl = document.getElementById('cart-total');
  const btnAgregar = document.getElementById('agregar-producto');
  const btnComprar = document.getElementById('btn-comprar');
  const cpInput = document.getElementById('cp-estimado');
  const cpSuggestions = document.getElementById('cp-suggestions');
  const formEstimacion = document.getElementById('estimacion-envio-form');
  const resultadoEstimacion = document.getElementById('resultado-estimacion');

  let costoEnvio = 0;
  let carrito = CartUtils.getCart();

  async function fetchCPSuggestions(query){
    if(!cpSuggestions) return [];
    const resp = await fetch(`${API_BASE_URL}/api/codigos-postales/buscar?q=${encodeURIComponent(query)}`);
    if(!resp.ok) return [];
    return resp.json();
  }

  async function renderCPSuggestions(query){
    if(!cpSuggestions) return;
    cpSuggestions.innerHTML = '';
    const cps = await fetchCPSuggestions(query);
    cps.forEach(cp => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'list-group-item list-group-item-action';
      item.textContent = `${cp.cp} - ${cp.colonia}, ${cp.municipio}`;
      item.dataset.cp = cp.cp;
      cpSuggestions.appendChild(item);
    });
    cpSuggestions.style.display = cpSuggestions.children.length ? 'block' : 'none';
  }

  cpInput?.addEventListener('input', () => {
    renderCPSuggestions(cpInput.value.trim());
  });

  renderCPSuggestions('');

  cpSuggestions?.addEventListener('click', e => {
    if(e.target.matches('button[data-cp]')){
      cpInput.value = e.target.dataset.cp;
      cpSuggestions.style.display = 'none';
    }
  });

  document.addEventListener('click', e => {
    if(e.target !== cpInput && !cpSuggestions.contains(e.target)){
      cpSuggestions.style.display = 'none';
    }
  });

  function actualizarSubtotal(){
    let subtotal = 0;
    carrito.forEach(p => subtotal += p.precio * p.cantidad);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    envioEl.textContent = `$${costoEnvio.toFixed(2)}`;
    totalEl.textContent = `$${(subtotal + costoEnvio).toFixed(2)}`;
  }

  function renderCarrito(){
    // Obtener la versión más reciente del carrito almacenado
    carrito = CartUtils.getCart();
    cartItems.innerHTML = '';
    carrito.forEach(prod => {
      const card = document.createElement('div');
      const lowStock = prod.stock <= 10 && prod.stock > 0;
      const soldOut = prod.stock <= 0;
      const stockMsg = soldOut
        ? '<p class="stock-msg text-danger fw-bold">Producto agotado</p>'
        : lowStock
          ? '<p class="stock-msg text-warning fw-bold">\u00A1Quedan pocas unidades!</p>'
          : '';
      card.className = 'card p-3 cart-item-card form-card' + (soldOut ? ' sold-out' : '');
      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-12 col-md-2 text-center">
            <img src="../${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded" style="max-height:100px;">
          </div>
          <div class="col-12 col-md-5 mt-3 mt-md-0">
            <h6 class="mb-1">${prod.nombre}</h6>
            <p class="mb-1 text-muted">${prod.descripcion}</p>
            <p class="mb-1 text-muted">Peso: ${prod.pesoMinimo} - ${prod.pesoMaximo} kg</p>
            ${stockMsg}
          </div>
          <div class="col-12 col-md-3 text-center mt-3 mt-md-0">
            <div class="input-group justify-content-center">
              <button class="btn btn-outline-secondary">-</button>
              <input type="text" class="form-control text-center" value="${prod.cantidad}" style="max-width:60px;" inputmode="numeric" pattern="\\d*" maxlength="2">
              <button class="btn btn-outline-secondary">+</button>
            </div>
            <button class="btn btn-link text-danger mt-2">Quitar</button>
          </div>
          <div class="col-12 col-md-2 text-center mt-3 mt-md-0">
            <p class="fw-bold">$${(prod.precio * prod.cantidad).toFixed(2)}</p>
          </div>
        </div>`;
      cartItems.appendChild(card);
    });
    actualizarSubtotal();
    updateCartBadge();
  }

  cartItems.addEventListener('click', e => {
    if(e.target.tagName !== 'BUTTON') return;
    const card = e.target.closest('.card');
    const nombre = card.querySelector('h6').textContent;
    const prod = carrito.find(p => p.nombre === nombre);
    if(!prod) return;
    if(e.target.textContent === '+'){
      if(!prod.stock || prod.cantidad < prod.stock){
        prod.cantidad++;
      }
    }else if(e.target.textContent === '-' && prod.cantidad > 1){
      prod.cantidad--;
    }else if(e.target.textContent === 'Quitar'){
      carrito = carrito.filter(p => p.nombre !== nombre);
    }
    CartUtils.saveCart(carrito);
    renderCarrito();
  });

  btnAgregar?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modal-agregar-producto'));
    modal.show();
  });

  // Exponer la función para que otros scripts puedan actualizar el carrito en
  // tiempo real cuando se agreguen productos.
  window.renderCarrito = renderCarrito;

  renderCarrito();

  // Actualizar el carrito si otro script modifica el localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
      renderCarrito();
    }
  });

  function actualizarEnvio(cp){
    if(!cp) return;
    fetch(`${API_BASE_URL}/api/codigos-postales/${cp}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        costoEnvio = parseFloat(data.costoEnvio);
        resultadoEstimacion.textContent = `Costo estimado: $${costoEnvio.toFixed(2)}`;
        actualizarSubtotal();
      })
      .catch(() => {
        costoEnvio = 0;
        resultadoEstimacion.textContent = 'Costo estimado no disponible';
        actualizarSubtotal();
      });
  }

  formEstimacion?.addEventListener('submit', e => {
    e.preventDefault();
    actualizarEnvio(cpInput.value.trim());
  });

  btnComprar?.addEventListener('click', () => {
    if(carrito.length === 0){
      alert('El carrito está vacío');
      return;
    }
    const info = { envio: costoEnvio };
    localStorage.setItem('checkoutInfo', JSON.stringify(info));
    window.location.href = '/html/direccion.html';
  });
});
