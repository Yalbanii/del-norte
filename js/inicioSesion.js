const formElement = document.querySelector("form");
const mensaje = document.getElementById("mensaje");

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtener datos del formulario
  const loginData = Object.fromEntries([...new FormData(formElement)]);
  const localData = JSON.parse(localStorage.getItem(loginData.email));

  // Validar credenciales
  if (
    localData &&
    loginData.email === localData.email &&
    loginData.password === localData.password
  ) {
    mensaje.style.color = "green";
    mensaje.textContent = `Bienvenid@ ${localData.nombre}. Redirigiendo...`;

    // Redirigir tras 2 segundos
    setTimeout(() => {
      window.location.href = "../html/ajustesUsuario.html";
    }, 2000);
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Correo o contraseña incorrectos.";
  }
});
