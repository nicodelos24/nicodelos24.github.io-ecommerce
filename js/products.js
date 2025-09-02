document.addEventListener("DOMContentLoaded", () => {
  const catID = localStorage.getItem("catID");
  const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
  const contenedor = document.getElementById("contenedor-productos");
  const precioMinInput = document.getElementById("precio-min");
  const precioMaxInput = document.getElementById("precio-max");
  const filtrarBtn = document.getElementById("filtrar-precio");
  let productosOriginales = [];

  fetch(URL)
    .then(r => r.json())
    .then(data => {
      productosOriginales = data.products;
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
  //se agrega el filtro de búsqueda por nombre
  filtrarBtn.addEventListener("click", () => {
    const min = parseFloat(precioMinInput.value) || 0;
    const max = parseFloat(precioMaxInput.value) || Infinity;
    const filtrados = productosOriginales.filter(p => p.cost >= min && p.cost <= max);
    mostrarProductos(filtrados);
  });
  // --- Búsqueda en tiempo real ---
    const buscadorInput = document.getElementById("buscador");
      if (buscadorInput) {
    const aplicarFiltros = () => {
    const q = (buscadorInput.value || "").toLowerCase().trim();

    const min = parseFloat(precioMinInput?.value) || 0;
    const max = parseFloat(precioMaxInput?.value) || Infinity;
      
    const filtrados = productosOriginales.filter(p => {
      const titulo = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const coincideTexto = !q || titulo.includes(q) || desc.includes(q);
      const dentroDeRango = (p.cost >= min && p.cost <= max);
      return coincideTexto && dentroDeRango;
    });

    mostrarProductos(filtrados);
  };

  // Cada tecla filtra la lista
  buscadorInput.addEventListener("input", aplicarFiltros);

  // Cambios de rango de precios también filtran
  precioMinInput?.addEventListener("input", aplicarFiltros);
  precioMaxInput?.addEventListener("input", aplicarFiltros);
}
});