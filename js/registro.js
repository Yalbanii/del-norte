const form = document.getElementById("form-registro");
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorText = document.getElementById('error-password');

//Obtención de datos del formulario
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Para evitar el envío tradicional y poder procesar

    // Obtener datos con FormData y convertirlos a objeto
    const dataArray = [...new FormData(form)];
    const dataObject = Object.fromEntries(dataArray);

    console.log("Datos listos para enviar:", dataObject);
});

//Mostrar error si las contraseñas para registrarse son diferentes
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

