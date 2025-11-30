// MODO JSON (sin backend propio)
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  let usuario = localStorage.getItem("usuario");

  // Si no hay usuario y no estamos en login.html → redirige
  if (!usuario && !window.location.pathname.endsWith("login.html")) {
    window.location.href = "login.html";
  }

  // Elementos del navbar
  const navLogin = document.getElementById("nav-login");
  const navUsuario = document.getElementById("nav-usuario");
  const navLogout = document.getElementById("nav-logout");
  const nombreUsuario = document.getElementById("nombreUsuario");

  if (usuario) {
    // Ocultar "Iniciar sesión"
    if (navLogin) navLogin.style.display = "none";

    // Mostrar usuario y logout
    if (navUsuario) {
      navUsuario.style.display = "inline";
      nombreUsuario.textContent = usuario;
    }
    if (navLogout) navLogout.style.display = "inline";

    // Acción de cerrar sesión
    if (navLogout) {
      navLogout.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
      });
    }
  } else {
    // Mostrar "Iniciar sesión"
    if (navLogin) navLogin.style.display = "inline";

    // Ocultar usuario y logout
    if (navUsuario) navUsuario.style.display = "none";
    if (navLogout) navLogout.style.display = "none";
  }
});
