// validation.js
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newItemForm');
    if (!form) return;

    // -> Tercer parámetro en 'true' para que corra en capture phase
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
      }
      // en caso válido, no hace nada y deja que tu itemsController
      // procese el reset y la limpieza de clases
    }, true);
  });
})();
