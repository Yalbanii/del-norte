'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('direccion-list');
  const form = document.getElementById('form-direccion');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;

  function cargar() {
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/direcciones`)
      .then(r => r.json())
      .then(data => {
        lista.innerHTML = '';
        data.forEach(d => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.textContent = `${d.calle} ${d.numero}, ${d.colonia} CP ${d.codigoPostalId}`;
          lista.appendChild(li);
        });
      });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const direccion = {
      calle: document.getElementById('calle').value,
      numero: parseInt(document.getElementById('numero').value),
      colonia: document.getElementById('colonia').value,
      codigoPostalId: parseInt(document.getElementById('cp').value)
    };
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/direcciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(direccion)
    }).then(cargar);
  });

  cargar();
});
