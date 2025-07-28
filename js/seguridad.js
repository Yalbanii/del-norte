document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-pass');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('new-pass').value;
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass })
    }).then(() => alert('Contraseña actualizada'));
  });
});
