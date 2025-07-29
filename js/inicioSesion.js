const formElement = document.querySelector("form");
const mensaje = document.getElementById("mensaje");

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtener datos del formulario
  const loginData = Object.fromEntries([...new FormData(formElement)]);

  // Validar campos vacíos (nombre de usuario y contraseña)
  if (!loginData.email?.trim() || !loginData.password?.trim()) {
    mensaje.style.color = "red";
    mensaje.textContent = "Por favor, ingresa correo y contraseña.";
    return;
  }

  fetch(`${API_BASE_URL}/api/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(user => {
      const roles = {1: 'usuario', 2: 'editor', 3: 'admin'};
      user.rol = roles[user.rolId] || 'usuario';
      user.activo = user.activo !== false;
      mensaje.style.color = 'green';
      mensaje.textContent = `Bienvenid@ ${user.nombre}. Redirigiendo...`;
      localStorage.setItem('currentUser', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = "../html/ajustesUsuario.html";
      }, 2000);
    })
    .catch(() => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Correo o contraseña incorrectos.';
    });
});
