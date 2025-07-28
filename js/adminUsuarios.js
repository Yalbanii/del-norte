'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('usersContainer');
    fetch(`${API_BASE_URL}/api/usuarios`)
        .then(res => res.json())
        .then(users => {
            container.innerHTML = '';
            if (!Array.isArray(users) || users.length === 0) {
                container.innerHTML = '<p class="text-center">No hay usuarios registrados.</p>';
                return;
            }
            const roles = {1: 'Usuario', 2: 'Editor', 3: 'Admin'};
            users.forEach(u => {
                const row = document.createElement('div');
                row.className = 'row align-items-center mb-3 p-3 cart-item-card form-card';
                row.innerHTML = `
                    <div class="col-12 col-md-3 fw-bold">${u.nombre} ${u.apellido || ''}</div>
                    <div class="col-12 col-md-3">${u.email}</div>
                    <div class="col-12 col-md-2">${roles[u.rolId] || u.rolId}</div>
                    <div class="col-12 col-md-2">${u.activo !== false ? 'Activo' : 'Bloqueado'}</div>
                    <div class="col-12 col-md-2 text-md-end mt-2 mt-md-0">
                        <div class="btn-group" role="group">
                            <button class="btn btn-editar" data-id="${u.id}"><i class="fa fa-pencil"></i></button>
                            <button class="btn btn-borrar" data-id="${u.id}"><i class="fa fa-ban"></i></button>
                        </div>
                    </div>`;
                container.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error loading users', err);
            container.innerHTML = '<p class="text-center">Error al cargar usuarios.</p>';
        });

    container.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.classList.contains('btn-editar')) {
            window.location.href = `editarUsuario.html?id=${id}`;
        } else if (btn.classList.contains('btn-borrar')) {
            fetch(`${API_BASE_URL}/api/usuarios/${id}`)
                .then(r => r.json())
                .then(u => {
                    const updated = { activo: !u.activo };
                    return fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updated)
                    });
                })
                .then(() => location.reload());
        }
    });
});
