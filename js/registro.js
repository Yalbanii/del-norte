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

  // 6. Correo ya registrado
  if (localStorage.getItem(formData.email)) {
    mostrarError("Ya existe una cuenta con ese correo.");
    return;
  }

  // 7. Guardar y redirigir
  localStorage.setItem(formData.email, JSON.stringify(formData));

  mensaje.style.color = "green";
  mensaje.textContent = `Bienvenid@ ${formData.nombre}. Redirigiendo...`;

  setTimeout(() => {
    window.location.href = "../html/ajustesUsuario.html";
  }, 2000);
});

// Mostrar errores
function mostrarError(texto) {
  mensaje.style.color = "red";
  mensaje.textContent = texto;
}
