document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("productID");
  if (!id) {
    window.location.href = "products.html";
    return;
  }

  const infoUrl = PRODUCT_INFO_URL + id + EXT_TYPE;
  const commentsUrl = PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE;

  const $ = (s) => document.querySelector(s);

  // Carga de información principal
  fetch(infoUrl)
    .then((r) => r.json())
    .then((data) => {
      // Título y metadatos
      $("#p-name").textContent = data.name || "";
      $("#p-desc").textContent = data.description || "";
      $("#p-category").textContent = data.category || "";
      $("#p-sold").textContent = data.soldCount ?? 0;
      $("#p-price").textContent = `${data.currency} ${data.cost}`;

      // Galería principal + thumbnails
      const mainImg = $("#p-image-main");
      const thumbsCt = $("#p-thumbs");
      if (Array.isArray(data.images) && data.images.length) {
        mainImg.src = data.images[0];
        data.images.forEach((src, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-outline-secondary p-1";
          btn.innerHTML = `<img src="${src}" alt="Vista ${
            i + 1
          }" style="height:64px;object-fit:cover;">`;
          btn.addEventListener("click", () => {
            mainImg.src = src;
          });
          thumbsCt.appendChild(btn);
        });
      }

      // Relacionados
      const relCt = $("#related-list");
      relCt.innerHTML = "";
      (data.relatedProducts || []).forEach((rel) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        col.innerHTML = `
          <article class="related-card h-100" role="button" tabindex="0" aria-label="Ver ${rel.name}">
            <img src="${rel.image}" class="card-img-top" alt="${rel.name}">
            <div class="card-body">
              <p class="card-text">${rel.name}</p>
            </div>
          </article>
        `;
        const card = col.querySelector("article");
        const go = () => {
          localStorage.setItem("productID", String(rel.id));
          location.reload();
        };
        card.addEventListener("click", go);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter") go();
        });
        relCt.appendChild(col);
      });

      $("#p-buy").addEventListener("click", () => {
        alert("¡Producto agregado al carrito!");
      });
    })
    .catch((err) => {
      console.error(err);
      alert("No se pudo cargar la información del producto.");
    });

  // Comentarios
  fetch(commentsUrl)
    .then((r) => r.json())
    .then((comments) => {
      const ct = $("#comments-list");
      ct.innerHTML = "";
      comments.forEach((c) => {
        const art = document.createElement("article");
        art.className = "border rounded p-3";
        art.innerHTML = `
          <header class="mb-1">
            <strong>${c.user}</strong> · <span>${c.dateTime}</span> · <span>★${c.score}</span>
          </header>
          <p class="mb-0">${c.description}</p>
        `;
        ct.appendChild(art);
      });
    })
    .catch(() => {});
});

// Estrellitas de calificación :D

const stars = document.querySelectorAll("#star-rating span");
const scoreInput = document.getElementById("comment-score");

stars.forEach((star, index) => {
  // Añade la clase hover a las estrellas cuando paso el mouse, así se resalta hasta la estrella donde tengo el mouse
  star.addEventListener("mouseover", () => {
    stars.forEach((s) => s.classList.remove("hover"));
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add("hover");
    }
  });

  // Acá para que al hacer click se seleccionen cuantas hay, y guarda ese valor
  star.addEventListener("click", () => {
    const value = parseInt(star.getAttribute("data-value")); //convierte el data-value en el valor de cada estrella (ej: 3 estrellas = value: 3)
    scoreInput.value = value; // así el input hidden de comment-score se guarda con el valor de la estrella que le dimos

    // Esto limpia la selección previa, así si primero pongo 3 estrellas, y luego 4, no se muestran 7, sino que el último valor
    stars.forEach((s) => s.classList.remove("selected"));

    // Le agrega la clase a las estrellitas seleccionadas
    for (let i = 0; i < value; i++) {
      stars[i].classList.add("selected");
    }
  });
});

// Esto quita el efecto hover al sacar el mouse
document.getElementById("star-rating").addEventListener("mouseleave", () => {
  stars.forEach((s) => s.classList.remove("hover"));
});
