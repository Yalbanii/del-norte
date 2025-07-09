
//! Carrito: agregar items, subtotal y localStorage

document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-total");
  const botonRandom = document.getElementById("agregar-random");

  // Lista de productos 
  const productosEjemplo = [
    { id: 1, nombre: "Birria de Res", precio: 150.00, imagen: "/Birria.avif", descripcion: "Deliciosa birria tradicional." },
    { id: 2, nombre: "Carne Seca", precio: 120.00, imagen: "CarneSeca.png", descripcion: "Obtenido de carne premium. Producto deshidratado al 50% de lo original." },
    { id: 3, nombre: "Rack Francés", precio: 180.00, imagen: "RackFrances.avif", descripcion: "El Rack se obtiene del corte de 8-9 costillas adheridas al semiespinazo, contiene lomo, el músculo intercostal y la grasa han sido retiradas." }
  ];

  // Recuperar carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Agrega producto al carrito
  function agregarAlCarrito(producto) {
    // Verificar si ya existe
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    renderizarCarrito();
  }

  // Guardar en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Renderizar carrito en HTML
  function renderizarCarrito() {
    cartItems.innerHTML = "";
    carrito.forEach(producto => {
      const card = document.createElement("div");
      card.className = "card p-3";
      card.setAttribute("data-precio", producto.precio);

      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-12 col-md-2 text-center">
            <img src="../assets/productos/${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded" style="max-height: 100px;">
          </div>
          <div class="col-12 col-md-5 mt-3 mt-md-0">
            <h6 class="mb-1">${producto.nombre}</h6>
            <p class="mb-1 text-muted">${producto.descripcion}</p>
          </div>
          <div class="col-12 col-md-3 text-center mt-3 mt-md-0">
            <div class="input-group justify-content-center">
              <button class="btn btn-outline-secondary">-</button>
              <input type="text" class="form-control text-center" value="${producto.cantidad}" style="max-width: 60px;" inputmode="numeric" pattern="\\d*" maxlength="2">
              <button class="btn btn-outline-secondary">+</button>
            </div>
            <button class="btn btn-link text-danger mt-2">Quitar</button>
          </div>
          <div class="col-12 col-md-2 text-center mt-3 mt-md-0">
            <p class="fw-bold">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
          </div>
        </div>
      `;
      cartItems.appendChild(card);
    });

    actualizarSubtotal();
  }

  // Actualizar subtotal total
  function actualizarSubtotal() {
    let total = 0;
    carrito.forEach(p => {
      total += p.precio * p.cantidad;
    });
    subtotalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Manejo de cantidad y quitar producto
  cartItems.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const card = e.target.closest(".card");
      const nombre = card.querySelector("h6").textContent;
      const producto = carrito.find(p => p.nombre === nombre);

      if (!producto) return;

      if (e.target.textContent === "+") {
        producto.cantidad++;
      } else if (e.target.textContent === "-" && producto.cantidad > 1) {
        producto.cantidad--;
      } else if (e.target.textContent === "Quitar") {
        carrito = carrito.filter(p => p.nombre !== nombre);
      }

      guardarCarrito();
      renderizarCarrito();
    }
  });

  //* Botón: agregar producto aleatorio
  botonRandom.addEventListener("click", () => {
    const random = productosEjemplo[Math.floor(Math.random() * productosEjemplo.length)];
    agregarAlCarrito(random);
  });

  // Inicializar carrito desde localStorage
  renderizarCarrito();
});

//! GASTO ESTIMADO DE ENVIO 

  const estados = {
    "Jalisco": {
      "Guadalajara": ["44100", "44110", "44120"],
      "Zapopan": ["45100", "45110"]
    },
    "CDMX": {
      "Coyoacán": ["04000", "04100"],
      "Benito Juárez": ["03000", "03100"]
    }
  };

  const estadoSelect = document.getElementById("estado-estimado");
  const ciudadSelect = document.getElementById("ciudad-estimada");
  const cpSelect = document.getElementById("cp-estimado");

  // Llenar estados al cargar
  Object.keys(estados).forEach(estado => {
    const option = document.createElement("option");
    option.value = estado;
    option.textContent = estado;
    estadoSelect.appendChild(option);
  });

  // Cambiar ciudades según estado
  estadoSelect.addEventListener("change", () => {
    const estado = estadoSelect.value;
    ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
    cpSelect.innerHTML = '<option value="">Selecciona un CP</option>';

    if (estado && estados[estado]) {
      Object.keys(estados[estado]).forEach(ciudad => {
        const option = document.createElement("option");
        option.value = ciudad;
        option.textContent = ciudad;
        ciudadSelect.appendChild(option);
      });
    }
  });

  // Cambiar CP según ciudad
  ciudadSelect.addEventListener("change", () => {
    const estado = estadoSelect.value;
    const ciudad = ciudadSelect.value;
    cpSelect.innerHTML = '<option value="">Selecciona un CP</option>';

    if (estado && ciudad && estados[estado][ciudad]) {
      estados[estado][ciudad].forEach(cp => {
        const option = document.createElement("option");
        option.value = cp;
        option.textContent = cp;
        cpSelect.appendChild(option);
      });
    }
  });

// ! Validación de información de pago 

document.getElementById('payment-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita el envío si hay errores

  const tarjeta = this.elements['tarjeta'].value.trim();
  const titular = this.elements['titular'].value.trim();
  const expiracion = this.elements['expiracion'].value;
  const cvv = this.elements['cvv'].value.trim();

  const errores = [];

  // Función para validar número de tarjeta usando algoritmo de Luhn
  function validarTarjetaLuhn(numero) {
    let suma = 0;
    let alternar = false;

    for (let i = numero.length - 1; i >= 0; i--) {
      let n = parseInt(numero[i]);

      if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
      }

      suma += n;
      alternar = !alternar;
    }

    return suma % 10 === 0;
  }

  // Validación de número de tarjeta
  if (!/^\d{16}$/.test(tarjeta) || !validarTarjetaLuhn(tarjeta)) {
    errores.push('El número de tarjeta no es válido.');
  }

  // Validación de nombre del titular
  if (titular === '') {
    errores.push('El nombre del titular es obligatorio.');
  }

  // Validación de fecha de expiración
  if (!expiracion) {
    errores.push('La fecha de vencimiento es obligatoria.');
  } else {
    const [año, mes] = expiracion.split('-').map(Number);
    const fechaExp = new Date(año, mes - 1);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaExp < hoy) {
      errores.push('La tarjeta está vencida.');
    }
  }

  // Validación de CVV
  if (!/^\d{3,4}$/.test(cvv)) {
    errores.push('El CVV debe tener 3 o 4 dígitos.');
  }

  if (errores.length > 0) {
    alert('Errores en el formulario de pago:\n- ' + errores.join('\n- '));
    return;
  }

  alert('¡Pago procesado con éxito!');
  // Aquí puedes guardar en localStorage o redirigir si lo deseas
});

//! fin de validación de información de pago 
