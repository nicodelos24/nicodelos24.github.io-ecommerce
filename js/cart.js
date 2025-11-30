
async function enviarCarrito() {
  const cart = CartUtils.loadCart() || [];

  // Adaptamos el carrito a lo que tu backend espera
  const carritoParaEnviar = cart.map(item => ({
    id_producto: item.id,
    cantidad: item.quantity,
    precio: item.cost
  }));

  const response = await fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: 1,        // temporal
      items: carritoParaEnviar
    })
  });

  const data = await response.json();
  console.log("Respuesta del servidor (carrito enviado):", data);

  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cartcontainer");
  const cart = CartUtils.loadCart();

  const grandTotalEl = document.getElementById("grandTotal");
  
  const costSubtotalEl = document.getElementById("cost-subtotal");
  const costEnvioEl = document.getElementById("cost-envio");
  const costTotalEl = document.getElementById("cost-total");

  function updateCostos() {
    const cartNow = CartUtils.loadCart();
    let subtotal = 0;
    cartNow.forEach(item => {
      const unit = Number(item.cost) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += (unit * qty);
    });

    const shippingSelected = document.querySelector('.envio-option:checked');
    const shippingPercent = shippingSelected ? Number(shippingSelected.dataset.percent) : 0;

    const costoEnvio = subtotal * shippingPercent;
    const total = subtotal + costoEnvio;

    costSubtotalEl.textContent = subtotal.toFixed(2);
    costEnvioEl.textContent = costoEnvio.toFixed(2);
    costTotalEl.textContent = total.toFixed(2);
    grandTotalEl.textContent = total.toFixed(2);
  }

  function updateGrandTotal() {
    updateCostos();
  }

  function validarCompra() {
    const errores = [];

    const dep = document.getElementById("dep").value.trim();
    const loc = document.getElementById("loc").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const esquina = document.getElementById("esquina").value.trim();

    if (!dep || !loc || !calle || !numero || !esquina) {
      errores.push("Todos los campos de dirección son obligatorios.");
    }

    const envioSeleccionado = document.querySelector('.envio-option:checked');
    if (!envioSeleccionado) {
      errores.push("Debe seleccionar un tipo de envío.");
    }

    const cartNow = CartUtils.loadCart();
    let cantidadesValidas = true;
    cartNow.forEach(item => {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) cantidadesValidas = false;
    });

    if (!cantidadesValidas || cartNow.length === 0) {
      errores.push("Todos los productos deben tener una cantidad mayor a 0.");
    }

    const pagoSeleccionado = document.querySelector('.pago-option:checked');
    if (!pagoSeleccionado) {
      errores.push("Debe seleccionar una forma de pago.");
    } else {
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

  function mostrarExito() {
    alert("¡Compra realizada con éxito! Gracias por su compra.");
    CartUtils.saveCart([]);
    CartUtils.updateCartBadge();
    location.reload();
  }

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
                <button class="btn-qty" data-action="dec">−</button>
                <input class="qty-input" type="text" inputmode="numeric" value="${qty}">
                <button class="btn-qty" data-action="inc">+</button>
              </div>

              <div class="line-price">$<span class="lineValue">${line}</span></div>
            </div>
          </div>

          <div class="summary">
            <div class="muted">Subtotal</div><div>$<span class="subtotal">${line}</span></div>
            <div class="muted">Total</div><div>$<span class="total">${line}</span></div>

            <div class="mt-3 text-end">
              <button class="btn btn-link text-danger p-0" type="button" data-action="remove">Quitar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(div);

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

  actions.querySelector('[data-action="finalizar"]').addEventListener("click", async () => {
    const errores = validarCompra();

    if (errores.length > 0) {
      mostrarErrores(errores);
    } else {
      await enviarCarrito();   
      mostrarExito();          
    }
  });


  const shippingOptions = document.querySelectorAll('.envio-option');
  shippingOptions.forEach(option => {
    option.addEventListener('change', () => {
      updateCostos();
    });
  });

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

  updateCostos();

});
