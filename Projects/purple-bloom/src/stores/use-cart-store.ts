import { create } from "zustand";

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => {
      const qty = newItem.quantity ?? 1;
      const existingIndex = state.items.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.size === newItem.size &&
          i.color === newItem.color
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return { items: updated };
      }
      return {
        items: [
          ...state.items,
          {
            productId: newItem.productId,
            size: newItem.size,
            color: newItem.color,
            quantity: qty,
          },
        ],
      };
    }),
  removeItem: (productId, size, color) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color)
      ),
    })),
  updateQuantity: (productId, size, color, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        ),
      };
    }),
  clearCart: () => set({ items: [] }),
}));
