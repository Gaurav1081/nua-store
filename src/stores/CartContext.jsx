import { createContext, useContext, useReducer, useEffect } from 'react';

// Cart item shape: { id, productId, name, image, price, color, size, quantity }

const CartContext = createContext(null);

const STORAGE_KEY = 'nua_cart';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action;
      const existingIdx = state.findIndex(
        (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
      );
      if (existingIdx >= 0) {
        return state.map((i, idx) =>
          idx === existingIdx ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...state, { ...item, id: `${item.productId}-${item.color}-${item.size}-${Date.now()}` }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.id);
    case 'UPDATE_QUANTITY': {
      const qty = Math.max(1, Math.min(10, action.quantity));
      return state.map((i) => (i.id === action.id ? { ...i, quantity: qty } : i));
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadFromStorage);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
