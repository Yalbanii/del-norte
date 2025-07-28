 document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-productos');
  const buscar = document.getElementById('buscar-producto');
  const filtrar = document.getElementById('filtrar-categoria');

  const modalCantidadEl = document.getElementById('modal-cantidad-producto');
  const modalCantidadNombre = document.getElementById('cantidad-producto-nombre');
  const modalCantidadInput = document.getElementById('cantidad-producto-input');
  const modalCantidadStock = document.getElementById('cantidad-producto-stock');
  const modalCantidadConfirmar = document.getElementById('cantidad-producto-confirmar');
  const modalCantidad = modalCantidadEl ? new bootstrap.Modal(modalCantidadEl) : null;
  let productoSeleccionado = null;

  let productos = [];

   if(!lista) return;

   function render(){
     const q = (buscar.value || '').toLowerCase();
     const c = filtrar.value;
     lista.innerHTML = '';
      productos.filter(p =>
        (c === '' || String(p.categoriaId) === c) &&
        p.nombre.toLowerCase().includes(q)
      ).forEach(p => {
        const col = document.createElement('div');
        col.className = 'col';
        const imgSrc = `../${p.urlImagen}`; // ruta de la base de datos
        col.innerHTML = `
          <div class="border rounded p-2 h-100 d-flex flex-column">
            <img src="${imgSrc}" alt="${p.nombre}" class="img-fluid mb-2 rounded">
            <h6>${p.nombre}</h6>
            <p class="small flex-grow-1">${p.descripcion}</p>
            <div class="mt-2">
              <span class="fw-bold">$${parseFloat(p.precio).toFixed(2)}</span>
              <button class="btn btn-sm btn-primary ms-2" data-id="${p.id}">Agregar</button>
            </div>
          </div>`;
        lista.appendChild(col);
      });
   }

   fetch(`${API_BASE_URL}/api/productos`)
     .then(r => r.json())
     .then(data => { productos = data; render(); });

   buscar?.addEventListener('input', render);
   filtrar?.addEventListener('change', render);
  lista.addEventListener('click', e => {
    if(e.target.matches('button[data-id]')){
      const id = parseInt(e.target.dataset.id);
      const p = productos.find(pr => pr.id === id);
      if(p && modalCantidad){
        productoSeleccionado = p;
        const cart = CartUtils.getCart();
        const existente = cart.find(it => it.id === p.id);
        const max = p.stock - (existente ? existente.cantidad : 0);
        if(max <= 0){
          alert('No hay suficiente stock disponible.');
          return;
        }
        modalCantidadNombre.textContent = p.nombre;
        modalCantidadInput.value = 1;
        modalCantidadInput.max = max;
        modalCantidadStock.textContent = `Disponible: ${max}`;
        modalCantidad.show();
      }
    }
  });

  modalCantidadConfirmar?.addEventListener('click', () => {
    if(!productoSeleccionado) return;
    const cantidad = parseInt(modalCantidadInput.value);
    const max = parseInt(modalCantidadInput.max);
    if(isNaN(cantidad) || cantidad < 1){
      return;
    }
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
      stock: productoSeleccionado.stock
    }, cantidad);
    if(typeof window.renderCarrito === 'function') window.renderCarrito();
    modalCantidad.hide();
  });
 });
