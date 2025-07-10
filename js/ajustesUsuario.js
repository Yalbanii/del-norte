document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Buscar el único usuario guardado (por ahora asumimos solo uno)
  let datosUsuario = null;
  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    if (clave.includes("@")) { // Detecta claves que parecen correos
      const usuario = JSON.parse(localStorage.getItem(clave));
      if (usuario?.nombre) {
        datosUsuario = usuario;
        break;
      }
    }
  }

  // Mostrar nombre si existe
  if (datosUsuario && nombreSpan) {
    nombreSpan.textContent = datosUsuario.nombre;
  }

  // Cerrar sesión: eliminar todos los usuarios (o solo el detectado)
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      if (datosUsuario?.email) {
        localStorage.removeItem(datosUsuario.email);
      }
      window.location.href = "../index.html";
    });
  }
});
