//Inicializar en 0
const itemsController = new ItemsController(0);

const newItemForm = document.querySelector('#newItemForm');

// Add an 'onsubmit' event listener
newItemForm.addEventListener('submit', (event) => {
    // Prevent default action
    event.preventDefault();

    // Select the inputs
    const newNombre = document.querySelector('#newNombre');
    const newCantidad = document.querySelector('#newCantidad');
    const newDescripcion = document.querySelector('#newDescripcion');
    const newGramajeMin = document.querySelector('#newGramajeMin');
    const newGramajeMax = document.querySelector('#newGramajeMax');
    const newPrecio = document.querySelector('#newPrecio');
    const newImagen = document.querySelector('#newImagen');
    const newFicha = document.querySelector('#newFicha');

    const nombre = newNombre.value;
    const cantidad = newCantidad.value;
    const descripcion = newDescripcion.value;
    const gramajeMin = newGramajeMin.value;
    const gramajeMax = newGramajeMax.value;
    const precio = newPrecio.value;
    const imagen = newImagen.value;
    const ficha = newFicha.value;

    // Add the task to the task manager
    itemsController.addItem(nombre, cantidad, descripcion, gramajeMin, gramajeMax, precio, imagen, ficha);

    // Clear the form
   newNombre.value = '';
   newCantidad.value = '';
   newDescripcion.value = '';
   newGramajeMin.value = '';
   newGramajeMax.value = '';
   newPrecio.value = '';
   newImagen.value = '';
   newFicha.value = '';
});