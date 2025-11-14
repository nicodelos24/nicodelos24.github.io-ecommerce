// cart.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cartcontainer");
  const cart = CartUtils.loadCart();

  const grandTotalEl = document.getElementById("grandTotal");
  
  // Elementos de la sección de costos
  const costSubtotalEl = document.getElementById("cost-subtotal");
  const costEnvioEl = document.getElementById("cost-envio");
  const costTotalEl = document.getElementById("cost-total");

  // Función para calcular y actualizar los costos globales
  function updateCostos() {
    const cartNow = CartUtils.loadCart();
    
    // Calcular subtotal (suma de todos los productos)
    let subtotal = 0;
    cartNow.forEach(item => {
      const unit = Number(item.cost) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += (unit * qty);
    });
    
    // Obtener el porcentaje de envío seleccionado
    const shippingSelected = document.querySelector('.envio-option:checked');
    const shippingPercent = shippingSelected ? Number(shippingSelected.dataset.percent) : 0;
    
    // Calcular costo de envío
    const costoEnvio = subtotal * shippingPercent;
    
    // Calcular total
    const total = subtotal + costoEnvio;
    
    // Actualizar los elementos del DOM
    costSubtotalEl.textContent = subtotal.toFixed(2);
    costEnvioEl.textContent = costoEnvio.toFixed(2);
    costTotalEl.textContent = total.toFixed(2);
    grandTotalEl.textContent = total.toFixed(2);
  }

  function updateGrandTotal() {
    updateCostos();
  }

  // Función para validar la compra
  function validarCompra() {
    const errores = [];

    // Validar campos de dirección
    const dep = document.getElementById("dep").value.trim();
    const loc = document.getElementById("loc").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const esquina = document.getElementById("esquina").value.trim();

    if (!dep || !loc || !calle || !numero || !esquina) {
      errores.push("Todos los campos de dirección son obligatorios.");
    }

    // Validar que esté seleccionada la forma de envío
    const envioSeleccionado = document.querySelector('.envio-option:checked');
    if (!envioSeleccionado) {
      errores.push("Debe seleccionar un tipo de envío.");
    }

    // Validar cantidades de productos
    const cartNow = CartUtils.loadCart();
    let cantidadesValidas = true;
    cartNow.forEach(item => {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) {
        cantidadesValidas = false;
      }
    });
    
    if (!cantidadesValidas || cartNow.length === 0) {
      errores.push("Todos los productos deben tener una cantidad mayor a 0.");
    }

    // Validar que esté seleccionada una forma de pago
    const pagoSeleccionado = document.querySelector('.pago-option:checked');
    if (!pagoSeleccionado) {
      errores.push("Debe seleccionar una forma de pago.");
    } else {
      // Validar campos según la forma de pago seleccionada
      if (pagoSeleccionado.id === "tarjeta") {
        const cardNumber = document.getElementById("card-number").value.trim();
        const cardExp = document.getElementById("card-exp").value.trim();
        const cardCvv = document.getElementById("card-cvv").value.trim();

        if (!cardNumber || !cardExp || !cardCvv) {
          errores.push("Todos los campos de tarjeta de crédito son obligatorios.");
        }
      } else if (pagoSeleccionado.id === "transfer") {
        const bankName = document.getElementById("bank-name").value.trim();
        const bankAccount = document.getElementById("bank-account").value.trim();

        if (!bankName || !bankAccount) {
          errores.push("Todos los campos de transferencia bancaria son obligatorios.");
        }
      }
    }

    return errores;
  }

  // Función para mostrar mensaje de éxito
  function mostrarExito() {
    alert("¡Compra realizada con éxito! Gracias por su compra.");
    
     CartUtils.saveCart([]);
     CartUtils.updateCartBadge();
     location.reload();
  }

  // Función para mostrar errores
  function mostrarErrores(errores) {
    let mensaje = "Por favor corrija los siguientes errores:\n\n";
    errores.forEach((error, index) => {
      mensaje += `${index + 1}. ${error}\n`;
    });
    alert(mensaje);
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Tu carrito está vacío.</p>";
    CartUtils.updateCartBadge();
    return;
  }

  container.innerHTML = ""; 

  cart.forEach((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const unit = Number(item.cost) || 0;
    const line = unit * qty;

    const div = document.createElement("div");
    div.className = "cartcontainer";
    div.dataset.index = String(idx);

    div.innerHTML = `
      <div class="box">
        <div class="borde">
          <div class="product">
            <div class="productcontainer">
              <h5>${item.name || "Producto"}</h5>
              <img class="fotoproducto" src="${item.image || ""}" alt="${item.name || ""}">
            </div>
            <div class="mover">
              <div class="costo">
                <p>Costo</p>
                <p><span class="unitCost">$${unit}</span></p>
              </div>

              <div class="cantidad">
                <button class="btn-qty" data-action="dec" aria-label="Disminuir cantidad">−</button>
                <input class="qty-input" type="text" inputmode="numeric" value="${qty}" aria-label="Cantidad">
                <button class="btn-qty" data-action="inc" aria-label="Aumentar cantidad">+</button>
              </div>

              <div class="line-price">$<span class="lineValue">${line}</span></div>
            </div>
          </div>

          <div class="summary">
            <div class="muted">Subtotal</div><div>$<span class="subtotal">${line}</span></div>
            <div class="muted">Total</div><div>$<span class="total">${line}</span></div>

            <!-- Botón quitar dentro de la tarjeta -->
            <div class="mt-3 text-end">
              <button class="btn btn-link text-danger p-0" type="button" data-action="remove">Quitar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(div);

    // Handlers por item
    const inputQty = div.querySelector(".qty-input");
    const btnInc = div.querySelector('[data-action="inc"]');
    const btnDec = div.querySelector('[data-action="dec"]');
    const lineValue = div.querySelector(".lineValue");
    const elSubtotal = div.querySelector(".subtotal");
    const elTotal = div.querySelector(".total");

    const recalcAndPersist = (newQty) => {
      const i = Number(div.dataset.index);
      const cartNow = CartUtils.loadCart();
      cartNow[i].quantity = newQty;
      CartUtils.saveCart(cartNow);
      CartUtils.updateCartBadge();

      const newLine = unit * newQty;
      lineValue.textContent = newLine;
      elSubtotal.textContent = newLine;
      elTotal.textContent = newLine;

      // Actualizar costos globales en tiempo real
      updateCostos();
    };

    btnInc.addEventListener("click", () => {
      const q = Math.max(1, (Number(inputQty.value) || 1) + 1);
      inputQty.value = q;
      recalcAndPersist(q);
    });

    btnDec.addEventListener("click", () => {
      const q = Math.max(1, (Number(inputQty.value) || 1) - 1);
      inputQty.value = q;
      recalcAndPersist(q);
    });

    inputQty.addEventListener("input", () => {
      let q = parseInt(inputQty.value, 10);
      if (isNaN(q) || q < 1) q = 1;
      inputQty.value = q;
      recalcAndPersist(q);
    });

    div.querySelector('[data-action="remove"]').addEventListener("click", () => {
      const i = Number(div.dataset.index);
      const cartNow = CartUtils.loadCart();
      cartNow.splice(i, 1);
      CartUtils.saveCart(cartNow);
      CartUtils.updateCartBadge();
      location.reload();
    });
  });

  
  const actions = document.createElement("div");
  actions.className = "cart-actions d-flex justify-content-end gap-3 my-4";
  actions.innerHTML = `
    <button class="btn btn-outline-secondary" type="button" data-action="seguir">Seguir comprando</button>
    <button class="btn primary" type="button" data-action="finalizar">Finalizar compra</button>
  `;
  container.appendChild(actions);

  actions.querySelector('[data-action="seguir"]').addEventListener("click", () => {
    window.location.href = "categories.html";
  });
  actions.querySelector('[data-action="finalizar"]').addEventListener("click", () => {
    const errores = validarCompra();
    
    if (errores.length > 0) {
      mostrarErrores(errores);
    } else {
      mostrarExito();
    }
  });
  
  // Event listeners para los radio buttons de envío
  const shippingOptions = document.querySelectorAll('.envio-option');
  shippingOptions.forEach(option => {
    option.addEventListener('change', () => {
      updateCostos();
    });
  });

  // Event listeners para mostrar/ocultar campos de pago
  const pagoOptions = document.querySelectorAll('.pago-option');
  pagoOptions.forEach(option => {
    option.addEventListener('change', () => {
      const cardFields = document.getElementById('cardFields');
      const bankFields = document.getElementById('bankFields');
      
      if (option.id === 'tarjeta') {
        cardFields.classList.remove('d-none');
        bankFields.classList.add('d-none');
      } else if (option.id === 'transfer') {
        bankFields.classList.remove('d-none');
        cardFields.classList.add('d-none');
      }
    });
  });

  // Event listener para el botón "Finalizar compra" de la sección de costos
  const btnFinalizar = document.getElementById('btnFinalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      const errores = validarCompra();
      
      if (errores.length > 0) {
        mostrarErrores(errores);
      } else {
        mostrarExito();
      }
    });
  }

  // Calcular costos iniciales
  updateCostos();
});