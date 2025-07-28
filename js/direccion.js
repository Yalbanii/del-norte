'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const direccionSelect = document.getElementById('direccion-select');
  const shippingForm = document.getElementById('shipping-form');
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if(user){
    direccionSelect.classList.remove('d-none');
    fetch(`${API_BASE_URL}/api/usuarios/${user.id}/direcciones`)
      .then(r => r.json())
      .then(data => {
        direccionSelect.innerHTML = '<option value="">Nueva dirección</option>';
        data.forEach((d, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `${d.calle} ${d.numero || ''}, CP ${d.codigoPostalId}`;
          opt.dataset.info = JSON.stringify(d);
          direccionSelect.appendChild(opt);
        });
      });

    direccionSelect.addEventListener('change', () => {
      if(direccionSelect.value === ''){ shippingForm.reset(); return; }
      const info = JSON.parse(direccionSelect.selectedOptions[0].dataset.info);
      shippingForm.elements['direccion'].value = `${info.calle} ${info.numero || ''}`;
      shippingForm.elements['codigo_postal'].value = info.codigoPostalId;
      shippingForm.elements['complemento'].value = info.colonia || '';
    });
  }

  shippingForm.addEventListener('submit', async e => {
    e.preventDefault();
    let info;
    if(user && direccionSelect.value !== ''){
      info = JSON.parse(direccionSelect.selectedOptions[0].dataset.info);
    }else{
      info = {
        codigoPostalId: parseInt(shippingForm.elements['codigo_postal'].value),
        calle: shippingForm.elements['direccion'].value,
        numero: 0,
        colonia: shippingForm.elements['complemento'].value || ''
      };
      if(user){
        const res = await fetch(`${API_BASE_URL}/api/usuarios/${user.id}/direcciones`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(info)
        });
        info = await res.json();
      }
    }

    const checkout = JSON.parse(localStorage.getItem('checkoutInfo') || '{}');
    checkout.direccion = `${info.codigoPostalId} ${info.calle}`;
    localStorage.setItem('checkoutInfo', JSON.stringify(checkout));
    window.location.href = '/html/pago.html';
  });
});
