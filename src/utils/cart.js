export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (item) => {
  let cart = getCart();

  const existing = cart.find(i => i.itemId === item.itemId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (itemId) => {
  let cart = getCart();

  cart = cart.filter(item => item.itemId !== itemId);

  localStorage.setItem("cart", JSON.stringify(cart));
}

export const clearCart = () => {
  localStorage.removeItem("cart");
};