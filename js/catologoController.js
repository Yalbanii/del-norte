// catalogAdmin.js
class CatalogAdmin {
  constructor(storageKey = 'items') {
    this.storageKey = storageKey;
    this.items = [];
    this.container = document.querySelector('.catalogo');
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    this.items = raw ? JSON.parse(raw) : [];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.render();
  }

  edit(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    // Ejemplo rápido: usar prompts; sustituye por un modal si prefieres
    const nuevoNombre = prompt('Nuevo nombre:', item.nombre);
    if (nuevoNombre === null) return; // cancelado

    const nuevaDesc = prompt('Nueva descripción:', item.descripcion);
    if (nuevaDesc === null) return;

    item.nombre      = nuevoNombre.trim();
    item.descripcion = nuevaDesc.trim();
    // … aquí podrías pedir más campos …

    this.save();
    this.render();
  }

  render() {
    this.container.innerHTML = ''; // limpia viejas filas

    if (this.items.length === 0) {
      this.container.innerHTML = '<p>No hay productos registrados.</p>';
      return;
    }

    this.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'row align-items-center py-3 border-bottom';

      // Ajusta la ruta de la imagen según dónde la almacenes
      const imgSrc = item.imagen 
        ? `/uploads/${item.imagen}` 
        : 'https://via.placeholder.com/80';

      row.innerHTML = `
        <div class="col-2">
          <img src="${imgSrc}"
               class="img-fluid"
               alt="${item.nombre}">
        </div>
        <div class="col-8 text-start">
          <h5>${item.nombre}</h5>
          <p>${item.descripcion}</p>
        </div>
        <div class="col-2 text-end">
          <button class="btn btn-sm btn-danger btn-eliminar me-1">🗑️</button>
          <button class="btn btn-sm btn-primary btn-editar">✏️</button>
        </div>
      `;

      // Botón Eliminar
      row.querySelector('.btn-eliminar')
         .addEventListener('click', () => {
           if (confirm(`¿Eliminar "${item.nombre}"?`)) {
             this.remove(item.id);
           }
         });

      // Botón Editar
      row.querySelector('.btn-editar')
         .addEventListener('click', () => this.edit(item.id));

      this.container.appendChild(row);
    });
  }
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const catalog = new CatalogAdmin('items');
  catalog.load();
  catalog.render();
});
