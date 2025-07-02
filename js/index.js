// Inicializar y cargar desde localStorage
const itemsController = new ItemsController();
itemsController.loadItemsFromLocalStorage();

const newItemForm = document.querySelector('#newItemForm');

// Evento submit del formulario
newItemForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los campos del formulario
    const newNombre = document.querySelector('#newNombre');
    const newCantidad = document.querySelector('#newCantidad');
    const newDescripcion = document.querySelector('#newDescripcion');
    const newGramajeMin = document.querySelector('#newGramajeMin');
    const newGramajeMax = document.querySelector('#newGramajeMax');
    const newPrecio = document.querySelector('#newPrecio');
    const newImagen = document.querySelector('#newImagen');
    const newFicha = document.querySelector('#newFicha');

    // Obtener valores
    const nombre = newNombre.value.trim();
    const cantidad = parseInt(newCantidad.value);
    const descripcion = newDescripcion.value.trim();
    const gramajeMin = parseInt(newGramajeMin.value);
    const gramajeMax = parseInt(newGramajeMax.value);
    const precio = parseFloat(newPrecio.value);
    const imagen = newImagen.value.split("\\").pop(); 
    const ficha = newFicha.value.split("\\").pop();

    // Registrar producto
    itemsController.addItem(nombre, cantidad, descripcion, gramajeMin, gramajeMax, precio, imagen, ficha);

    // Limpiar formulario
    newNombre.value = '';
    newCantidad.value = '';
    newDescripcion.value = '';
    newGramajeMin.value = '';
    newGramajeMax.value = '';
    newPrecio.value = '';
    newImagen.value = '';
    newFicha.value = '';

    // Confirmación
    alert("Producto registrado y guardado en localStorage.");
});
