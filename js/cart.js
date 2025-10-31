document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartcontainer");
  const botones = document.querySelectorAll("[data-action]");
  const cantidad = document.getElementById("qty");

  if (cart.length === 0) {
    container.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  container.innerHTML = ""; // Limpiar contenido previo

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cartcontainer";
    div.innerHTML = `
    <div class="box">
      <!-- PRODUCTO -->
        <div class="borde">
            <div class="product">
                <div class="productcontainer">
                    <h5>Chevrolet Onix Joy</h5>
                    <img class="fotoproducto" src="${item.image}" alt="${item.name}">
                </div>
                <div class="mover">
                <div class="costo">
                    <p>Costo</p>
                    <p><span id="unitCost">$${item.cost}</span></p>
                </div>

        <div class="cantidad">
          <button class="btn-qty" id="dec-qty" data-action="dec" aria-label="Disminuir cantidad">−</button>
          <input class="qty-input" id="qty" type="text" value="1" inputmode="numeric" aria-label="Cantidad">
          <button class="btn-qty" id="inc-qty" data-action="inc" aria-label="Aumentar cantidad">+</button>
        </div>
        
        <div class="line-price">$<span id="line">${item.cost}</span></div>
        
</div>
      </div>

      <!-- RESUMEN -->
      <div class="summary">
        <div class="muted">Subtotal</div><div>$<span id="subtotal">${
          item.cost
        }</span></div>
        <div class="muted">Envío estimado</div><div>$<span id="ship">500</span></div>
        <div class="muted">Total</div><div>$<span id="total">${
          item.cost + 500
        }</span></div>
      </div>
</div>
      <!-- BOTONES -->
      <div class="footer">
        <button class="btn" type="button">Seguir comprando</button>
        <button class="btn primary" type="button">Finalizar compra</button>
      </div>
    </div>
  </div> 


      
    `;
    container.appendChild(div);
  });
});
