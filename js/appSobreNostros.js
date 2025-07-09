// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los elementos con la clase .animate-on-scroll
  const elements = document.querySelectorAll(".animate-on-scroll");

  // Crea un IntersectionObserver para detectar cuando los elementos
  // entren en la ventana de visualización
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Si el elemento es visible en el viewport
      if (entry.isIntersecting) {
        //agrega la clase que inicia la animación
        entry.target.classList.add("animate-fade-in");
        // Deja de observar el elemento para evitar repetir la animación
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Umbral: el 20% del elemento debe estar visible para activar la animación
    threshold: 0.2
  });

  // Asocia el observer a cada elemento seleccionado
  elements.forEach(el => observer.observe(el));
});