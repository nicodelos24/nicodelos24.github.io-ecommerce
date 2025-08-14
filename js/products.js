document.addEventListener("DOMContentLoaded", () => {
    const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const contenedor = document.getElementById("contenedor-productos");

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data.products);
        })
        .catch(error => console.error("Error al obtener los productos:", error));

    function mostrarProductos(productos) {
        contenedor.innerHTML = "";

        productos.forEach(prod => {
            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${prod.image}" alt="${prod.name}">
                    <h3>${prod.name}</h3>
                    <p>${prod.description}</p>
                    <p><strong>Precio:</strong> ${prod.currency} ${prod.cost}</p>
                    <p><strong>Vendidos:</strong> ${prod.soldCount}</p>
                </div>
            `;
        });
    }
});
