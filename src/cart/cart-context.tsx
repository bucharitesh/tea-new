import create from "zustand";
import { persist } from "zustand/middleware";

export type ProductGrade = "A" | "B" | "C";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Product {
  id: string;
  sellerId: string;
  invoiceNo: number;
  grade: ProductGrade;
  pkgs: number;
  kgPerBag: number;
  sampleUsed: number;
  price: number;
  division: boolean;
  verification_status: string;
  score?: {
    appearance: number;
    taste: number;
    liquor: number;
    infusion: number;
    grading: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (userId: string) => Promise<void>;
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cartItems: [...state.cartItems, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.product.id !== productId
          ),
        })),
      updateCartItemQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
      placeOrder: async (userId) => {
        const { cartItems } = get();
        if (cartItems.length === 0) {
          throw new Error("Cart is empty");
        }
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              cartItems: cartItems.map((item) => ({
                productId: item.product.id,
                sellerId: item.product.sellerId,
                invoiceNo: item.product.invoiceNo,
                grade: item.product.grade,
                pkgs: item.product.pkgs,
                kgPerBag: item.product.kgPerBag,
                sampleUsed: item.product.sampleUsed,
                price: item.product.price,
                division: item.product.division,
                quantity: item.quantity,
                priceAtPurchase: item.product.price,
              })),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to place order");
          }

          const data = await response.json();
          get().clearCart();
          return data.order;
        } catch (error) {
          console.error("Failed to place order:", error);
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useCart = () => {
  const store = useCartStore();
  return {
    ...store,
    cartTotal: store.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ),
    cartCount: store.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    ),
  };
};
