const form = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorText = document.getElementById("error-password");

// Regex
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^\d{10}$/;
const contraseñaSeguraRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Validar en tiempo real si coinciden
function validarCoincidencia() {
  if (confirmPasswordInput.value === "") {
    errorText.textContent = "";
    confirmPasswordInput.classList.remove('is-invalid');
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    errorText.textContent = "Las contraseñas no coinciden";
    confirmPasswordInput.classList.add('is-invalid');
  } else {
    errorText.textContent = "";
    confirmPasswordInput.classList.remove('is-invalid');
  }
}

passwordInput.addEventListener('input', validarCoincidencia);
confirmPasswordInput.addEventListener('input', validarCoincidencia);

// Envío del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = Object.fromEntries([...new FormData(form)]);

  // 1. Campos vacíos
  for (const [key, value] of Object.entries(formData)) {
    if (value.trim() === "") {
      mostrarError("Todos los campos son obligatorios.");
      return;
    }
  }

  // 2. Contraseñas coinciden
  if (formData.password !== formData["confirm-password"]) {
    mostrarError("Las contraseñas no coinciden.");
    confirmPasswordInput.classList.add('is-invalid');
    return;
  }

  // 3. Contraseña segura
  if (!contraseñaSeguraRegex.test(formData.password)) {
    mostrarError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
    return;
  }

  // 4. Correo válido
  if (!correoRegex.test(formData.email)) {
    mostrarError("Correo electrónico no válido.");
    return;
  }

  // 5. Teléfono válido
  if (!telefonoRegex.test(formData.telefono)) {
    mostrarError("El teléfono debe tener 10 dígitos.");
    return;
  }

  // 6. Guardar en base de datos y redirigir
  const payload = {
    nombre: formData.nombre,
    apellido: formData.apellido,
    email: formData.email,
    password: formData.password,
    rolId: 1,
  };

  // Utiliza la URL absoluta del backend para evitar que el
  // navegador envíe la solicitud al servidor estático donde se
  // aloja el frontend.
  fetch(`${API_BASE_URL}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('error');
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
      mostrarError('No se pudo registrar el usuario.');
    });
});

// Mostrar errores
function mostrarError(texto) {
  mensaje.style.color = "red";
  mensaje.textContent = texto;
}
