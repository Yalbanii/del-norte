const form = document.getElementById("form-sesion");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita que se recargue la página

  const usuario = document.getElementById("inputUsuario").value.trim();
  const password = document.getElementById("inputPassword").value.trim();

  if (!usuario || !password) {
    alert("Por favor, complete ambos campos.");
    return;
  }

  // Mostrar en consola-------------borrar al ya estar la base de datos
  console.log("Usuario:", usuario);
  console.log("Contraseña:", password);

  try {
    // const response = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ usuario, password })
    // });

    // const data = await response.json();

    // if (response.ok) {
    //   // Login correcto
    //   alert("Bienvenido, " + data.nombre + "!");
    //   // Redirige, por ejemplo:
    //   window.location.href = "panel.html";
    // } else {
    //   // Credenciales incorrectas
    //   alert(data.mensaje || "Credenciales incorrectas");
    // }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error de conexión con el servidor");
  }
});
