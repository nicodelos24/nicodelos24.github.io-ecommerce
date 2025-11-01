
const CART_KEY = 'cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return loadCart().reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
}

function updateCartBadge() {
  const badge = document.querySelector('[data-cart-badge]');
  if (!badge) return;
  const n = getCartCount();
  badge.textContent = n;
  badge.style.display = n > 0 ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', updateCartBadge);

window.CartUtils = { loadCart, saveCart, getCartCount, updateCartBadge };
