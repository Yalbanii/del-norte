'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-metodos');
  const form = document.getElementById('form-metodo');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if(!user) return;

  function cargar(){
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/metodos-pago`)
      .then(r=>r.json())
      .then(data=>{
        lista.innerHTML='';
        data.forEach(m=>{
          const li=document.createElement('li');
          li.className='list-group-item d-flex justify-content-between align-items-center';
          li.textContent=`**** **** **** ${m.ultimos4}`;
          const del=document.createElement('button');
          del.className='btn btn-sm btn-danger';
          del.textContent='Eliminar';
          del.addEventListener('click',()=>{
            fetch(`${API_BASE_URL}/api/usuarios/${user.id}/metodos-pago/${m.id}`,{method:'DELETE'}).then(cargar);
          });
          li.appendChild(del);
          lista.appendChild(li);
        });
      });
  }

  form?.addEventListener('submit',e=>{
    e.preventDefault();
    const numero=form.elements['numero'].value.trim();
    const expiracion=form.elements['expiracion'].value;
    const tipo='tarjeta';
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/metodos-pago`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({token:numero,tipo,fechaExpiracion:expiracion})
    }).then(()=>{form.reset();cargar();});
  });

  cargar();
});
