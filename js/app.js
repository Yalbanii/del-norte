
window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// app.js
document.addEventListener('DOMContentLoaded', () => {
  const items = JSON.parse(localStorage.getItem('items') || '[]');
  const catalogo = document.querySelector('.catalogo');

  catalogo.innerHTML = items.map(item => `
    <div class="producto-card row align-items-center border rounded mb-3 p-3">
      <div class="col-4 col-md-2">
        <img src="${item.imagen?.name || '/assets/default.png'}"
             class="img-fluid border rounded"
             alt="${item.nombre}">
      </div>
      <div class="col-8 col-md-7 text-start">
        <h2 class="fs-5 fw-bold">${item.nombre}</h2>
        <p class="mb-2 d-none d-md-block">${item.descripcion}</p>
      </div>
      <div class="col-12 col-md-3 text-md-end mt-2 mt-md-0">
        <div class="btn-group" role="group">
          <button class="btn btn-ver"><i class="fa fa-eye"></i></button>
          <button class="btn btn-editar"
                  onclick="location.href='editProduct.html?id=${item.id}'">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="btn btn-borrar"
                  onclick="removeItem(${item.id})">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  window.removeItem = id => {
    if (!confirm('¿Eliminar este producto?')) return;
    const nuevos = items.filter(i => i.id !== id);
    localStorage.setItem('items', JSON.stringify(nuevos));
    location.reload();
  };
});


