const newItemForm = document.querySelector('#newItemForm');

// Evento submit del formulario
// Se usa capture=true para ejecutar este manejador
// antes del que se registra en itemsController.js
newItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Obtener los campos del formulario
    const newNombre = document.querySelector('#newNombre');
    const newCantidad = document.querySelector('#newCantidad');
    const newDescripcion = document.querySelector('#newDescripcion');
    const newPrecio = document.querySelector('#newPrecio');
    const newCategoria = document.querySelector('#newCategoria');
    const newImagen = document.querySelector('#newImagen');
    const newFicha = document.querySelector('#newFicha');

    // Obtener valores
    const nombre = newNombre.value.trim();
    const cantidad = parseInt(newCantidad.value, 10);
    const descripcion = newDescripcion.value.trim();
    const precio = parseFloat(newPrecio.value);
    const categoriaId = parseInt(newCategoria.value, 10);
    let ficha = '';
    if (newFicha.files[0]) {
        const fdFicha = new FormData();
        fdFicha.append('file', newFicha.files[0]);
        const resFicha = await fetch(`${API_BASE_URL}/api/uploads/sheets`, {
            method: 'POST',
            body: fdFicha
        });
        if (resFicha.ok) {
            const data = await resFicha.json();
            ficha = data.path;
        }
    }

    let imagen = '';
    if (newImagen.files[0]) {
        const formData = new FormData();
        formData.append('file', newImagen.files[0]);
        const res = await fetch(`${API_BASE_URL}/api/uploads/products`, {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            const data = await res.json();
            imagen = data.path;
        }
    }

    const body = {
        nombre,
        descripcion,
        precio,
        stock: cantidad,
        urlImagen: imagen,
        urlFichaTecnica: ficha,
        categoriaId
    };

    const mensaje = document.getElementById('mensajeExito');

    try {
        const res = await fetch(`${API_BASE_URL}/api/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error('Error');

        await res.json();

        mensaje.textContent = 'Producto creado con \u00E9xito';
        mensaje.style.display = 'block';
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 5000);
    } catch {
        mensaje.textContent = 'No se pudo registrar el producto';
        mensaje.classList.remove('alert-success');
        mensaje.classList.add('alert-danger');
        mensaje.style.display = 'block';
    }

    // Limpiar formulario
    newNombre.value = '';
    newCantidad.value = '';
    newDescripcion.value = '';
    newPrecio.value = '';
    newImagen.value = '';
    newFicha.value = '';
    newCategoria.value = '';
}, true);
