document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  const datosUsuario = JSON.parse(localStorage.getItem('currentUser'));

  // Mostrar nombre si existe
  if (datosUsuario && nombreSpan) {
    nombreSpan.textContent = datosUsuario.nombre;
  }

  // Cerrar sesión: eliminar usuario en sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem('currentUser');
      window.location.href = "../index.html";
    });
  }
});
