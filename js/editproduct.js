document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productsContainer');
    let productos = JSON.parse(localStorage.getItem('items') || '[]');

    // 1) Función para renderizar todas las tarjetas
    function renderProductos() {
        container.innerHTML = '';
        if (productos.length === 0) {
            container.innerHTML = '<p class="text-center">No hay productos aún.</p>';
            return;
        }

        productos.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'producto-card row align-items-center border rounded mb-3 p-3';
            card.innerHTML = `
        <div class="col-4 col-md-2">
          <img src="${p.imagenURL || '/assets_admin_management/pierna.png'}"
               alt="${p.nombre}"
               class="img-fluid border rounded">
        </div>
        <div class="col-8 col-md-7">
          <h2 class="fs-5 fw-bold">${p.nombre}</h2>
          <p class="mb-2 d-none d-md-block">${p.descripcion}</p>
        </div>
        <div class="col-12 col-md-3 text-md-end mt-2 mt-md-0">
          <div class="btn-group" role="group">
            <button class="btn btn-ver"    data-idx="${idx}"><i class="fa fa-eye"></i></button>
            <button class="btn btn-editar" data-idx="${idx}"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-borrar" data-idx="${idx}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      `;
            container.appendChild(card);
        });
    }

    // 2) Listener único para ver / editar / borrar
    container.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const idx = Number(btn.dataset.idx);

        if (btn.classList.contains('btn-borrar')) {
            // BORRAR producto
            if (confirm(`¿Eliminar "${productos[idx].nombre}"?`)) {
                productos.splice(idx, 1);
                localStorage.setItem('items', JSON.stringify(productos));
                renderProductos();
            }
        }
        else if (btn.classList.contains('btn-editar')) {
            // REDIRIGIR a la página de edición
            window.location.href = `editarProducto.html?id=${idx}`;
        }
        else if (btn.classList.contains('btn-ver')) {
            // REDIRIGIR a la página de detalle
            window.location.href = `verproducto.html?id=${idx}`;
        }
    });

    // 3) Render inicial
    renderProductos();
});

// js/editarProducto.js
document.addEventListener('DOMContentLoaded', () => {
    // Referencias al form y campos
    const form = document.getElementById('newItemForm');
    const nombreInput = document.getElementById('newNombre');
    const cantidadInput = document.getElementById('newCantidad');
    const descInput = document.getElementById('newDescripcion');
    const gramMinInput = document.getElementById('newGramajeMin');
    const gramMaxInput = document.getElementById('newGramajeMax');
    const precioInput = document.getElementById('newPrecio');
    const imgInput = document.getElementById('newImagen');
    const fichaInput = document.getElementById('newFicha');
    const btnEliminar = document.getElementById('btnEliminar');

    // Leo parámetro ?id= del query string
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    // Cargo array de localStorage
    let productos = JSON.parse(localStorage.getItem('items') || '[]');
    let editingIndex = -1;

    // Si hay id => modo EDICIÓN
    if (idParam !== null) {
        editingIndex = parseInt(idParam, 10);
        if (isNaN(editingIndex) || editingIndex < 0 || editingIndex >= productos.length) {
            alert('Producto no existe.');
            return window.location.href = 'productos.html';
        }
        const prod = productos[editingIndex];
        // Prefill campos de texto/número
        nombreInput.value = prod.nombre || '';
        cantidadInput.value = prod.cantidad || '';
        descInput.value = prod.descripcion || '';
        gramMinInput.value = prod.gramajeMin || '';
        gramMaxInput.value = prod.gramajeMax || '';
        precioInput.value = prod.precio || '';
        // no prellenamos <input type="file">
        btnEliminar.style.display = 'inline-block';
    } else {
        // Modo CREAR
        btnEliminar.style.display = 'none';
    }

    // Función para guardar (nuevo o editado)
    function finishSave(nuevoObj) {
        if (editingIndex >= 0) productos[editingIndex] = nuevoObj;
        else productos.push(nuevoObj);
        localStorage.setItem('items', JSON.stringify(productos));
        window.location.href = '/html/adminManagement.html';
    }

    // SUBMIT: crear o actualizar
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const base = {
            nombre: nombreInput.value.trim(),
            cantidad: Number(cantidadInput.value),
            descripcion: descInput.value.trim(),
            gramajeMin: Number(gramMinInput.value),
            gramajeMax: Number(gramMaxInput.value),
            precio: parseFloat(precioInput.value),
            imagenURL: productos[editingIndex]?.imagenURL || '',
            fichaURL: productos[editingIndex]?.fichaURL || ''
        };

        // Si sube imagen, la leemos
        if (imgInput.files.length > 0) {
            const fr = new FileReader();
            fr.onload = () => {
                base.imagenURL = fr.result;
                // Si sube ficha técnica además
                if (fichaInput.files.length > 0) {
                    const fr2 = new FileReader();
                    fr2.onload = () => {
                        base.fichaURL = fr2.result;
                        finishSave(base);
                    };
                    fr2.readAsArrayBuffer(fichaInput.files[0]);
                } else finishSave(base);
            };
            fr.readAsDataURL(imgInput.files[0]);
        }
        // Si sólo sube ficha
        else if (fichaInput.files.length > 0) {
            const fr2 = new FileReader();
            fr2.onload = () => {
                base.fichaURL = fr2.result;
                finishSave(base);
            };
            fr2.readAsArrayBuffer(fichaInput.files[0]);
        }
        // Ningún archivo nuevo
        else {
            finishSave(base);
        }
    });

    // ELIMINAR (solo en edición)
    btnEliminar.addEventListener('click', () => {
        if (editingIndex < 0) return;
        if (confirm(`¿Eliminar "${productos[editingIndex].nombre}"?`)) {
            productos.splice(editingIndex, 1);
            localStorage.setItem('items', JSON.stringify(productos));
            window.location.href = 'productos.html';
        }
    });
});
