document.addEventListener("DOMContentLoaded", () => {  // Se supone que con esto carga el html
                                                        // antes que se ejecute el js o algo asi


    const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";


    const contenedor = document.getElementById("contenedor-productos");  //este es el id del products.html donde 
                                                                        // aparecen los autos

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data.products);     //Acá todo el quilombo del fetch y cosa color
        })
        .catch(error => console.error("Error al obtener los productos:", error));

    function mostrarProductos(productos) {
        contenedor.innerHTML = "";  //Por cada producto limpia todo el campo anterior

        productos.forEach(producto => {     
                                    // y acá mete todos los datos al contenedor con la
                                    // sintaxis fea esa del `${objeto.propiedad}`
            contenedor.innerHTML += `  
                <div class="producto">
                    <img src="${producto.image}" alt="${producto.name}">
                    <h3 class="titulo-producto">${producto.name}</h3>
                    <p>${producto.description}</p>
                    <p>Precio: ${producto.currency} ${producto.cost}</p>
                    <p>Vendidos: ${producto.soldCount}</p>
                </div>
            `;
        });     // hay que cambiar el h3 p y strong dependiendo como quieramos decorar
    }
});