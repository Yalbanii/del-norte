// itemsController.js
class ItemsController {
  constructor(currentId = 0) {
    this.items = [];
    this.currentId = currentId;
  }

  addItem(nombre, cantidad, descripcion, gramajeMin, gramajeMax, precio, imagen, ficha) {
    const item = {
      id: this.currentId++,
      nombre,
      cantidad,
      descripcion,
      gramajeMin,
      gramajeMax,
      precio,
      imagen,
      ficha,
    };
    this.items.push(item);
    this.saveItemsToLocalStorage();
    console.log('✅ Agregado:', item);
  }

  saveItemsToLocalStorage() {
    const json = JSON.stringify(this.items);
    localStorage.setItem("items", json);
    localStorage.setItem("currentId", this.currentId.toString());
    console.log('✅ LocalStorage.items =', json);
  }

  loadItemsFromLocalStorage() {
    const storageItems = localStorage.getItem("items");
    const storedId     = localStorage.getItem("currentId");
    if (storageItems) this.items = JSON.parse(storageItems);
    if (storedId)     this.currentId = parseInt(storedId, 10);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newItemForm');
  const itemsCtrl = new ItemsController();
  itemsCtrl.loadItemsFromLocalStorage();

  form.addEventListener('submit', e => {
    e.preventDefault();

    // 1) Si NO es válido, salimos y validation.js mostrará los errores
    if (!form.checkValidity()) return;

    // 2) Extraemos valores
    const nombre      = form.newNombre.value.trim();
    const cantidad    = parseInt(form.newCantidad.value, 10);
    const descripcion = form.newDescripcion.value.trim();
    const gramajeMin  = parseFloat(form.newGramajeMin.value);
    const gramajeMax  = parseFloat(form.newGramajeMax.value);
    const precio      = parseFloat(form.newPrecio.value);
    const imagenFile  = form.newImagen.files[0] || null;
    const fichaFile   = form.newFicha.files[0]  || null;

    // 3) Guardamos el item
    itemsCtrl.addItem(
      nombre, cantidad, descripcion,
      gramajeMin, gramajeMax, precio,
      imagenFile, fichaFile
    );

    // 4) Reseteamos el formulario
    form.reset();

    // 5) Quitamos la validación de Bootstrap para que no se muestren errores
    form.classList.remove('was-validated');

    // 6) Si Bootstrap agregó clases a los inputs (.is-valid / .is-invalid), las limpias también
    form.querySelectorAll('.form-control, .form-select, textarea').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    // (Opcional) Aquí podrías volver a renderizar tu tabla/listado de items
  });
});