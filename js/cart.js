// cart.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cartcontainer");
  const cart = CartUtils.loadCart();

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
            <div class="muted">Envío estimado</div><div>$<span class="ship">500</span></div>
            <div class="muted">Total</div><div>$<span class="total">${line + 500}</span></div>

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
    const ship = 500;

    const recalcAndPersist = (newQty) => {
      const i = Number(div.dataset.index);
      const cartNow = CartUtils.loadCart();
      cartNow[i].quantity = newQty;
      CartUtils.saveCart(cartNow);
      CartUtils.updateCartBadge();

      const newLine = unit * newQty;
      lineValue.textContent = newLine;
      elSubtotal.textContent = newLine;
      elTotal.textContent = newLine + ship;
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
    alert("Implementar flujo de checkout");
  });
});
