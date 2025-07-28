'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cuponesContainer');
  if (!container) return;

  function loadCupones() {
    fetch(`${API_BASE_URL}/api/cupones`)
      .then(r => r.json())
      .then(cupones => {
        container.innerHTML = '';
        if (!Array.isArray(cupones) || cupones.length === 0) {
          container.innerHTML = '<p class="text-center">No hay cupones.</p>';
          return;
        }
        cupones.forEach(c => {
          const row = document.createElement('div');
          row.className = 'row align-items-center mb-3 p-3 cart-item-card form-card';
          row.innerHTML = `
            <div class="col-12 col-md-3 fw-bold">${c.codigo}</div>
            <div class="col-12 col-md-3">${c.descripcion || ''}</div>
            <div class="col-12 col-md-2">${c.descuento}</div>
            <div class="col-12 col-md-2">${c.fechaFin || ''}</div>
            <div class="col-12 col-md-2 text-md-end mt-2 mt-md-0">
              <div class="btn-group" role="group">
                <button class="btn btn-editar" data-id="${c.id}"><i class="fa fa-pencil"></i></button>
                <button class="btn btn-borrar" data-id="${c.id}"><i class="fa fa-trash"></i></button>
              </div>
            </div>`;
          container.appendChild(row);
        });
      })
      .catch(err => {
        console.error('Error loading cupones', err);
        container.innerHTML = '<p class="text-center">Error al cargar cupones.</p>';
      });
  }

  container.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('btn-editar')) {
      window.location.href = `crearCupon.html?id=${id}`;
    } else if (btn.classList.contains('btn-borrar')) {
      if (confirm('¿Eliminar este cupón?')) {
        fetch(`${API_BASE_URL}/api/cupones/${id}`, { method: 'DELETE' })
          .then(() => loadCupones());
      }
    }
  });

  loadCupones();
});
