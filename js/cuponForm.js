document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cuponForm');
  if (!form) return;
  const codigo = document.getElementById('codigo');
  const descripcion = document.getElementById('descripcion');
  const descuento = document.getElementById('descuento');
  const tipo = document.getElementById('tipo');
  const inicio = document.getElementById('inicio');
  const fin = document.getElementById('fin');
  const usosMaximos = document.getElementById('usosMaximos');
  const btnEliminar = document.getElementById('btnEliminar');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    fetch(`${API_BASE_URL}/api/cupones/${id}`)
      .then(r => r.json())
      .then(c => {
        codigo.value = c.codigo || '';
        descripcion.value = c.descripcion || '';
        descuento.value = c.descuento || '';
        tipo.value = c.tipo || 'porcentaje';
        inicio.value = c.fechaInicio || '';
        fin.value = c.fechaFin || '';
        usosMaximos.value = c.usosMaximos || '';
      });
    btnEliminar.style.display = 'inline-block';
  } else {
    btnEliminar.style.display = 'none';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = {
      codigo: codigo.value,
      descripcion: descripcion.value,
      descuento: parseFloat(descuento.value),
      tipo: tipo.value,
      fechaInicio: inicio.value || null,
      fechaFin: fin.value || null,
      usosMaximos: usosMaximos.value ? parseInt(usosMaximos.value, 10) : null
    };
    const url = id ? `${API_BASE_URL}/api/cupones/${id}` : `${API_BASE_URL}/api/cupones`;
    const method = id ? 'PUT' : 'POST';
    fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(res => {
        if (res.ok) {
          window.location.href = '/html/cupones.html';
        } else {
          alert('Error al guardar');
        }
      })
      .catch(() => alert('Error de red'));
  });

  btnEliminar.addEventListener('click', () => {
    if (!id) return;
    if (confirm('¿Eliminar este cupón?')) {
      fetch(`${API_BASE_URL}/api/cupones/${id}`, { method: 'DELETE' })
        .then(() => window.location.href = '/html/cupones.html');
    }
  });
});
