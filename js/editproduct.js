'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productsContainer');
    if(!container) return;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('btnSearch');
    const categoryItems = document.querySelectorAll('#categoryDropdown .dropdown-item');
    let currentCategoria = '';
    let productos = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isEditor = currentUser.rol === 'editor';

    // 1) Función para renderizar todas las tarjetas
    function renderProductos() {
        container.innerHTML = '';
        if (productos.length === 0) {
            container.innerHTML = '<p class="text-center">No hay productos aún.</p>';
            return;
        }

        productos.forEach((p) => {
            const card = document.createElement('div');
            card.className = 'row align-items-center mb-3 p-3 cart-item-card form-card';
            card.innerHTML = `
        <div class="col-4 col-md-2">
          <img src="${p.urlImagen ? '../' + p.urlImagen : '/assets_admin_management/pierna.png'}"
               alt="${p.nombre}"
               class="img-fluid border rounded">
        </div>
        <div class="col-8 col-md-7">
          <h2 class="fs-5 fw-bold">${p.nombre}</h2>
          <p class="mb-2 d-none d-md-block">${p.descripcion}</p>
        </div>
        <div class="col-12 col-md-3 text-md-end mt-2 mt-md-0">
          <div class="btn-group" role="group">
            <button class="btn btn-ver"    data-id="${p.id}"><i class="fa fa-eye"></i></button>
            <button class="btn btn-editar" data-id="${p.id}"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-borrar" data-id="${p.id}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      `;
            if(isEditor){
                const del = card.querySelector('.btn-borrar');
                del.remove();
            }
            container.appendChild(card);
        });
    }

    // Cargar productos desde el backend
    function buildQuery(){
        const params = new URLSearchParams();
        const term = searchInput ? searchInput.value.trim() : '';
        if(term){
            params.append('q', term);
        }
        if(currentCategoria){
            params.append('categoria', currentCategoria);
        }
        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }

    function loadProductos() {
        fetch(`${API_BASE_URL}/api/productos${buildQuery()}`)
            .then(r => r.json())
            .then(data => {
                productos = data;
                renderProductos();
            })
            .catch(err => {
                console.error('Error al cargar productos', err);
                container.innerHTML = '<p class="text-center">Error al cargar productos.</p>';
            });
    }

    searchBtn?.addEventListener('click', () => loadProductos());
    searchInput?.addEventListener('keyup', e => {
        if(e.key === 'Enter') loadProductos();
    });
    categoryItems.forEach(it => {
        it.addEventListener('click', () => {
            currentCategoria = it.dataset.cat || '';
            const dropBtn = document.getElementById('categoryDropdownBtn');
            if(dropBtn){
                dropBtn.textContent = it.textContent;
            }
            loadProductos();
        });
    });

    // 2) Listener único para ver / editar / borrar
    container.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.dataset.id;

        if (btn.classList.contains('btn-borrar')) {
            if(isEditor) return;
            if (confirm('¿Eliminar este producto?')) {
                fetch(`${API_BASE_URL}/api/productos/${id}`, { method: 'DELETE' })
                    .then(() => loadProductos());
            }
        }
        else if (btn.classList.contains('btn-editar')) {
            window.location.href = `editarProducto.html?id=${id}`;
        }
        else if (btn.classList.contains('btn-ver')) {
            window.location.href = `verproducto.html?id=${id}`;
        }
    });

    // 3) Render inicial
    loadProductos();
});

// js/editarProducto.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newItemForm');
    if (!form) return;

    const nombreInput = document.getElementById('newNombre');
    const cantidadInput = document.getElementById('newCantidad');
    const descInput = document.getElementById('newDescripcion');
    const precioInput = document.getElementById('newPrecio');
    const categoriaSelect = document.getElementById('newCategoria');
    const imagenInput = document.getElementById('newImagen');
    const fichaInput = document.getElementById('newFicha');
    const currentImg = document.getElementById('currentImagen');
    const currentFicha = document.getElementById('currentFicha');
    const previewImg = document.getElementById('previewImagen');
    const previewFicha = document.getElementById('previewFicha');
    const btnEliminar = document.getElementById('btnEliminar');

    let currentProducto = null;

    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isEditor = currentUser.rol === 'editor';

    if (idParam) {
        fetch(`${API_BASE_URL}/api/productos/${idParam}`)
            .then(r => r.json())
            .then(p => {
                currentProducto = p;
                nombreInput.value = p.nombre || '';
                cantidadInput.value = p.stock || '';
                descInput.value = p.descripcion || '';
                precioInput.value = p.precio || '';
                categoriaSelect.value = p.categoriaId || '';
                if (p.urlImagen) {
                    currentImg.src = '../' + p.urlImagen;
                } else {
                    currentImg.src = '/assets_admin_management/pierna.png';
                }
                if (p.urlFichaTecnica) {
                    currentFicha.textContent = p.urlFichaTecnica;
                    currentFicha.href = '../' + p.urlFichaTecnica;
                } else {
                    currentFicha.textContent = 'Sin ficha técnica';
                    currentFicha.removeAttribute('href');
                }
                btnEliminar.style.display = isEditor ? 'none' : 'inline-block';
            })
            .catch(() => {
                alert('Producto no encontrado');
                window.location.href = '/html/adminManagement.html';
            });
    } else {
        btnEliminar.style.display = 'none';
    }

    imagenInput.addEventListener('change', () => {
        const file = imagenInput.files[0];
        if (file) {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }
    });

    fichaInput.addEventListener('change', () => {
        const file = fichaInput.files[0];
        previewFicha.textContent = file ? file.name : '';
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let imagenPath = currentProducto ? currentProducto.urlImagen : '';
        if (imagenInput.files[0]) {
            const fd = new FormData();
            fd.append('file', imagenInput.files[0]);
            const resImg = await fetch(`${API_BASE_URL}/api/uploads/products`, {
                method: 'POST',
                body: fd
            });
            if (resImg.ok) {
                const data = await resImg.json();
                imagenPath = data.path;
            }
        }
        let fichaPath = currentProducto ? currentProducto.urlFichaTecnica : '';
        if (fichaInput.files[0]) {
            const fdFicha = new FormData();
            fdFicha.append('file', fichaInput.files[0]);
            const resFicha = await fetch(`${API_BASE_URL}/api/uploads/sheets`, {
                method: 'POST',
                body: fdFicha
            });
            if (resFicha.ok) {
                const data = await resFicha.json();
                fichaPath = data.path;
            }
        }

        const producto = {
            nombre: nombreInput.value.trim(),
            descripcion: descInput.value.trim(),
            precio: parseFloat(precioInput.value),
            stock: parseInt(cantidadInput.value, 10),
            urlImagen: imagenPath,
            urlFichaTecnica: fichaPath,
            categoriaId: parseInt(categoriaSelect.value, 10)
        };

        const url = idParam ?
            `${API_BASE_URL}/api/productos/${idParam}` :
            `${API_BASE_URL}/api/productos`;
        const method = idParam ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (res.ok) {
            const saved = await res.json();
            currentProducto = saved;
            currentImg.src = '../' + saved.urlImagen;
            categoriaSelect.value = saved.categoriaId;
            imagenInput.value = '';
            previewImg.style.display = 'none';
            if (saved.urlFichaTecnica) {
                currentFicha.textContent = saved.urlFichaTecnica;
                currentFicha.href = '../' + saved.urlFichaTecnica;
            } else {
                currentFicha.textContent = 'Sin ficha técnica';
                currentFicha.removeAttribute('href');
            }
        } else {
            alert('Error al guardar');
        }
    });

    btnEliminar.addEventListener('click', () => {
        if (!idParam || isEditor) return;
        if (confirm('¿Eliminar este producto?')) {
            fetch(`${API_BASE_URL}/api/productos/${idParam}`, { method: 'DELETE' })
                .then(() => window.location.href = '/html/adminManagement.html');
        }
    });
});
