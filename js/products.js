document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".btn-tab");
    const sections = document.querySelectorAll(".container .row-cols-2");

    const mapping = {
      "Cordero": 0,
      "Res": 1,
      "Procesados": 2,
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // Activar botón
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Mostrar solo la sección correspondiente
        const label = button.textContent.trim();
        const targetIndex = mapping[label];

        sections.forEach((section, index) => {
          if (index === targetIndex) {
            // Mostrar con animación
            section.classList.remove("hidden", "fade-out");
            section.classList.add("fade-in");
          } else {
            // Aplicar fade-out y luego ocultar
            section.classList.remove("fade-in");
            section.classList.add("fade-out");

            // Esperar que termine la animación y ocultar
            setTimeout(() => {
              section.classList.add("hidden");
            }, 400); // duración de fadeOut en milisegundos
          }
        });
      });
    });
  });