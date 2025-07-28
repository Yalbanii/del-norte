'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editUserForm');
  if (!form) return;
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const email = document.getElementById('email');
  const rol = document.getElementById('rol');
  const activo = document.getElementById('activo');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    fetch(`${API_BASE_URL}/api/usuarios/${id}`)
      .then(r => r.json())
      .then(u => {
        nombre.value = u.nombre || '';
        apellido.value = u.apellido || '';
        email.value = u.email || '';
        rol.value = u.rolId || 1;
        activo.checked = u.activo !== false;
      });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const usuario = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: email.value.trim(),
      rolId: parseInt(rol.value, 10),
      activo: activo.checked
    };

    fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    }).then(res => {
      if (res.ok) {
        window.location.href = '/html/adminUsuarios.html';
      } else {
        alert('Error al guardar');
      }
    });
  });
});
