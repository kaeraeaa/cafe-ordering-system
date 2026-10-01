import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cafe_cart")) || [];
    } catch {
      return [];
    }
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem("cafe_cart", JSON.stringify(next));
  };

  const addToCart = (product) => {
    const exists = items.find((item) => item.id === product.id);
    if (exists) {
      persist(
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      persist([{ ...product, quantity: 1 }, ...items]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    persist(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id) => persist(items.filter((item) => item.id !== id));
  const clearCart = () => persist([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const value = useMemo(
    () => ({ items, count, total, addToCart, updateQuantity, removeFromCart, clearCart }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
