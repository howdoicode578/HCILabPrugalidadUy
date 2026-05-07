export const addToCart = (item) => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.itemId === item.itemId
  );

  if (existingItemIndex !== -1) {

    cart[existingItemIndex].quantity += item.quantity;

  } else {

    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};

export const removeFromCart = (itemId) => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((item) => item.itemId !== itemId);

  localStorage.setItem("cart", JSON.stringify(cart));
};