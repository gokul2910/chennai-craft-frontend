import { useState } from 'react';
import { CartContext } from './cartContext';

const STORAGE_KEY = 'chennai-craft-cart';
const MAX_PER_ITEM = 20;

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(loadStored);

  const save = (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setItems(next);
  };

  const addItem = (product, quantity = 1) => {
    const maxQty = Math.min(product.stock, MAX_PER_ITEM);
    if (maxQty <= 0) return;

    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      save(
        items.map((i) =>
          i.productId === product.id
            ? { ...i, maxQty, quantity: Math.min(i.quantity + quantity, maxQty) }
            : i
        )
      );
    } else {
      save([
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          shopName: product.shopName,
          imageUrl: product.imageUrl,
          maxQty,
          quantity: Math.min(quantity, maxQty),
        },
      ]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    save(
      items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQty)) }
          : i
      )
    );
  };

  const removeItem = (productId) => {
    save(items.filter((i) => i.productId !== productId));
  };

  const clear = () => save([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = { items, count, total, addItem, updateQuantity, removeItem, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}