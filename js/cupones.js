document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cuponForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = {
      codigo: document.getElementById('codigo').value,
      descripcion: document.getElementById('descripcion').value,
      descuento: parseFloat(document.getElementById('descuento').value),
      tipo: document.getElementById('tipo').value,
      fechaInicio: document.getElementById('inicio').value || null,
      fechaFin: document.getElementById('fin').value || null,
      usosMaximos: document.getElementById('usosMaximos').value ? parseInt(document.getElementById('usosMaximos').value,10) : null
    };
    fetch('http://localhost:8080/api/cupones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(res => {
      if(res.ok) alert('Cupón creado');
      else alert('Error al crear cupón');
    }).catch(() => alert('Error de red'));
    form.reset();
  });
});
