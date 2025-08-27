document.addEventListener("DOMContentLoaded", () => {
  const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
  const contenedor = document.getElementById("contenedor-productos");

  fetch(URL)
    .then(r => r.json())
    .then(data => {
      mostrarProductos(data.products);
    })
    .catch(err => console.error("Error al obtener los productos:", err));

  function mostrarProductos(productos) {
    contenedor.innerHTML = "";
    contenedor.setAttribute("aria-busy", "true");

    const frag = document.createDocumentFragment();

    productos.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-4";
      col.innerHTML = `
        <article class="producto h-100">
          <img src="${p.image}" alt="${p.name}" class="img-fluid"
               loading="lazy">
          <h3 class="titulo-producto">${p.name}</h3>
          <p>${p.description}</p>
          <p><strong>Precio:</strong> ${p.currency} ${p.cost}</p>
          <p><small>Vendidos: ${p.soldCount}</small></p>
        </article>
      `;

      frag.appendChild(col);
    });

    contenedor.appendChild(frag);
    contenedor.setAttribute("aria-busy", "false");
  }
});