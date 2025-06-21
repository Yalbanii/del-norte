const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');

  header.addEventListener('click', () => {
    // Alternar la clase 'active' para mostrar/ocultar el contenido
    item.classList.toggle('active');

    // Cerrar otros elementos acordeón si no es un acordeón múltiple
    accordionItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
  });
});