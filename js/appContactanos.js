// Espera a que el documento HTML esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el formulario por su ID
    const form = document.getElementById("contact-form");

    // Evento que se activa cuando el usuario envía el formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Previene el envío por defecto del formulario (sin recargar la página)
        limpiarErrores(); // Limpia errores anteriores

        // Obtiene los valores de cada campo, quitando espacios al inicio y final
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        let errores = false; // Bandera que indica si hay errores de validación

        // Validación para cada campo: si está vacío, muestra mensaje de error
        if (!nombre) {
            mostrarError("nombre", "Por favor ingresa tu nombre.");
            errores = true;
        }

        if (!correo) {
            mostrarError("correo", "Por favor ingresa tu correo.");
            errores = true;
        } else {
            // Valida formato de correo electrónico usando expresión regular
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoRegex.test(correo)) {
                mostrarError("correo", "Correo inválido.");
                errores = true;
            }
        }

        if (!telefono) {
            mostrarError("telefono", "Por favor ingresa tu teléfono.");
            errores = true;
        } else {
            // Valida que el número de teléfono tenga exactamente 10 dígitos
            const telefonoRegex = /^[0-9]{10}$/;
            if (!telefonoRegex.test(telefono)) {
                mostrarError("telefono", "El número debe tener 10 dígitos.");
                errores = true;
            }
        }

        if (!asunto) {
            mostrarError("asunto", "Por favor ingresa el asunto.");
            errores = true;
        }

        if (!mensaje) {
            mostrarError("mensaje", "Por favor escribe tu mensaje.");
            errores = true;
        }

        // Si hubo errores, no continúa con el envío
        if (errores) return;

        // Si todo está bien, se crea un objeto con los datos del formulario
        const params = { nombre, correo, telefono, asunto, mensaje };

        // Se envía el formulario usando EmailJS
        emailjs.send('service_ai0pkqg', 'template_qi3agjt', params)
            .then(() => {
                alert("¡Mensaje enviado correctamente!"); // Muestra éxito
                form.reset(); // Limpia el formulario
            })
            .catch((error) => {
                console.error("Error al enviar mensaje:", error); // Muestra error en consola
                alert("Ocurrió un error al enviar el mensaje."); // Muestra mensaje de error
            });
    });
});

// Función que muestra un mensaje de error debajo de un campo específico
function mostrarError(id, mensaje) {
    const errorField = document.getElementById("error-" + id); // Busca el elemento <small> de error
    errorField.textContent = mensaje; // Inserta el mensaje de error
}

// Función que limpia todos los mensajes de error antes de una nueva validación
function limpiarErrores() {
    document.querySelectorAll(".error-message").forEach(el => {
        el.textContent = ""; // Borra el texto de todos los <small class="error-message">
    });
}
