import create from "zustand";
import { persist } from "zustand/middleware";

export type ProductGrade = "A" | "B" | "C";

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
  verification_status: "VERIFIED" | "PENDING" | "REJECTED";
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
  products: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  setProducts: (products: Product[]) => void;
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cartItems: [],
      products: [],
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
      setProducts: (products) => set({ products }),
    }),
    {
      name: "cart-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
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
