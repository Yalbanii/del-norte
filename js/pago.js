'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const pagoSelect = document.getElementById('pago-select');
  const paymentForm = document.getElementById('payment-form');
  const subtotalEl = document.getElementById('pago-subtotal');
  const envioEl = document.getElementById('pago-envio');
  const descuentoEl = document.getElementById('pago-descuento');
  const totalEl = document.getElementById('pago-total');
  const cuponInput = document.getElementById('cupon');
  const cuponMsg = document.getElementById('cupon-msg');
  const aplicarCuponBtn = document.getElementById('aplicar-cupon');
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  let subtotal = 0;
  let envio = 0;
  let descuento = 0;
  let cuponCodigo = '';

  function calcularTotales(){
    subtotal = 0;
    CartUtils.getCart().forEach(p => subtotal += p.precio * p.cantidad);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    envioEl.textContent = `$${envio.toFixed(2)}`;
    descuentoEl.textContent = `$${descuento.toFixed(2)}`;
    totalEl.textContent = `$${(subtotal + envio - descuento).toFixed(2)}`;
  }

  let tarjetas = [];
  let tarjetasKey = '';

  const checkoutInfo = JSON.parse(localStorage.getItem('checkoutInfo') || '{}');
  envio = parseFloat(checkoutInfo.envio || 0);
  calcularTotales();

  aplicarCuponBtn?.addEventListener('click', () => {
    const codigo = cuponInput.value.trim();
    if(!codigo) return;
    fetch(`${API_BASE_URL}/api/cupones/codigo/${encodeURIComponent(codigo)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(c => {
        cuponCodigo = codigo;
        if(c.tipo === 'porcentaje'){
          descuento = (subtotal + envio) * (parseFloat(c.descuento)/100);
        }else{
          descuento = parseFloat(c.descuento);
        }
        cuponMsg.textContent = '';
        calcularTotales();
      })
      .catch(() => {
        cuponCodigo = '';
        descuento = 0;
        cuponMsg.textContent = 'Cup\u00f3n no v\u00e1lido';
        calcularTotales();
      });
  });

  if(user){
    pagoSelect.classList.remove('d-none');
    tarjetasKey = `tarjetas_${user.id}`;
    tarjetas = JSON.parse(localStorage.getItem(tarjetasKey) || '[]');
    pagoSelect.innerHTML = '<option value="">Nueva tarjeta</option>';
    tarjetas.forEach((t,i)=>{
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `**** **** **** ${t.tarjeta.slice(-4)} - ${t.titular}`;
      opt.dataset.info = JSON.stringify(t);
      pagoSelect.appendChild(opt);
    });

    pagoSelect.addEventListener('change', () => {
      if(pagoSelect.value === ''){ paymentForm.reset(); return; }
      const t = JSON.parse(pagoSelect.selectedOptions[0].dataset.info);
      paymentForm.elements['tarjeta'].value = t.tarjeta;
      paymentForm.elements['titular'].value = t.titular;
      paymentForm.elements['expiracion'].value = t.expiracion;
      paymentForm.elements['cvv'].value = t.cvv;
    });
  }

  function validarTarjetaLuhn(numero){
    let suma=0; let alternar=false;
    for(let i=numero.length-1;i>=0;i--){
      let n=parseInt(numero[i]);
      if(alternar){ n*=2; if(n>9) n-=9; }
      suma+=n; alternar=!alternar;
    }
    return suma%10===0;
  }

  function enviarCompra(token, deviceSessionId, items, direccion){
    fetch(`${API_BASE_URL}/api/compras`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ usuarioId: user ? user.id : null, direccion, metodo:'tarjeta', token, deviceSessionId, envio, cupon: cuponCodigo, items })
    })
    .then(async r => {
      if(!r.ok){
        const txt = await r.text();
        throw new Error(txt || 'Error al procesar la compra');
      }
      return r.json();
    })
    .then(() => {
      CartUtils.saveCart([]);
      localStorage.removeItem('checkoutInfo');
      alert('¡Pago procesado con éxito!');
      window.location.href = '/index.html';
    })
    .catch(err => alert(err.message));
  }

  paymentForm.addEventListener('submit', e => {
    e.preventDefault();
    const tarjeta = paymentForm.elements['tarjeta'].value.trim();
    const titular = paymentForm.elements['titular'].value.trim();
    const expiracion = paymentForm.elements['expiracion'].value;
    const cvv = paymentForm.elements['cvv'].value.trim();
    const errores = [];
    if(!/^\d{16}$/.test(tarjeta) || !validarTarjetaLuhn(tarjeta)) errores.push('El número de tarjeta no es válido.');
    if(titular==='') errores.push('El nombre del titular es obligatorio.');
    if(!expiracion){ errores.push('La fecha de vencimiento es obligatoria.'); } else {
      const [a, m] = expiracion.split('-').map(Number);
      const fechaExp = new Date(a, m-1); const hoy = new Date(); hoy.setHours(0,0,0,0);
      if(fechaExp < hoy) errores.push('La tarjeta está vencida.');
    }
    if(!/^\d{3,4}$/.test(cvv)) errores.push('El CVV debe tener 3 o 4 dígitos.');
    if(errores.length>0){ alert('Errores en el formulario:\n- '+errores.join('\n- ')); return; }

    if(user && pagoSelect.value === ''){
      tarjetas.push({tarjeta, titular, expiracion, cvv});
      localStorage.setItem(tarjetasKey, JSON.stringify(tarjetas));
    }

    const cart = CartUtils.getCart();
    if(cart.length === 0){ alert('El carrito está vacío'); return; }
    const items = cart.map(p => ({productoId:p.id, cantidad:p.cantidad}));
    const checkout = JSON.parse(localStorage.getItem('checkoutInfo') || '{}');
    const direccion = checkout.direccion || '';

    const [expYearFull, expMonth] = expiracion.split('-');
    const expYear = expYearFull.slice(-2); // Openpay expects two-digit year
    const cardData = {
      holder_name: titular,
      card_number: tarjeta,
      expiration_year: expYear,
      expiration_month: expMonth,
      cvv2: cvv
    };

    if(!window.OpenPay){
      // Entorno sin acceso a Openpay. Se envía un token ficticio para permitir
      // pruebas locales del flujo de compra.
      const deviceSessionId = 'offline-' + Math.random().toString(36).slice(2);
      const token = 'tok_' + Math.random().toString(36).slice(2);
      enviarCompra(token, deviceSessionId, items, direccion);
      return;
    }

    OpenPay.setId(OPENPAY_MERCHANT_ID);
    OpenPay.setApiKey(OPENPAY_PUBLIC_KEY);
    OpenPay.setSandboxMode(OPENPAY_SANDBOX);
    OpenPay.deviceData.setup('payment-form', 'deviceSessionId');
    const deviceSessionId = document.getElementById('deviceSessionId').value;

    OpenPay.token.create(cardData, function(resp){
      const token = resp.data.id;
      enviarCompra(token, deviceSessionId, items, direccion);
    }, function(err){
      alert('Error en tokenización: ' + (err.description || ''));
    });
  });
});
