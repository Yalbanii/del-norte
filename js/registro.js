const form = document.getElementById("form-registro");
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorText = document.getElementById('error-password');

// Crear contenedor de mensajes debajo del formulario
let messageBox = document.createElement('p');
messageBox.style.marginTop = '10px';
messageBox.style.fontWeight = 'bold';
form.appendChild(messageBox);

// Validación de coincidencia de contraseñas
function validarCoincidencia() {
  if (confirmPassword.value === "") {
    errorText.textContent = "";
    confirmPassword.classList.remove('is-invalid');
  } else if (password.value !== confirmPassword.value) {
    errorText.textContent = "Las contraseñas no coinciden";
    confirmPassword.classList.add('is-invalid');
  } else {
    errorText.textContent = "";
    confirmPassword.classList.remove('is-invalid');
  }
}

password.addEventListener('input', validarCoincidencia);
confirmPassword.addEventListener('input', validarCoincidencia);

// Evento de envío del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();

  validarCoincidencia();
  if (password.value !== confirmPassword.value) {
    return;
  }

  const dataArray = [...new FormData(form)];
  const dataObject = Object.fromEntries(dataArray);

  // Verificar si ya existe una cuenta con ese correo
  if (localStorage.getItem(dataObject.email)) {
    messageBox.textContent = "Ya existe una cuenta con este correo.";
    messageBox.style.color = "red";
    return;
  }

  // Guardar usuario
  localStorage.setItem(dataObject.email, JSON.stringify(dataObject));
  // Guardar usuario activo
  //localStorage.setItem("usuarioActivo", dataObject.nombre);

  messageBox.textContent = "Registro exitoso. Redirigiendo...";
  messageBox.style.color = "green";

  setTimeout(() => {
    window.location.href = "../html/ajustesUsuario.html";
  }, 2000);
});
