"use client";

import React, { useEffect } from "react";
import { useCart, Product, CartItem } from "./cart-context";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash } from "lucide-react";

export const AddToCartForm = ({ product }: { product: Product }) => {
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const isProductInCart = cartItems.some(
    (item) => item.product.id === product.id
  );

  return (
    <Button onClick={handleAddToCart} disabled={isProductInCart}>
      {isProductInCart ? "Added" : "Add to cart"}
    </Button>
  );
};

export const CartItemActions = ({ item }: { item: CartItem }) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (qty: number) => {
    if (qty >= 1) {
      updateCartItemQuantity(item.product.id, qty);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleQuantityChange(item.quantity - 1)}
      >
        -
      </Button>
      <Input
        className="h-8 w-14 text-xs"
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleQuantityChange(item.quantity + 1)}
      >
        +
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => removeFromCart(item.product.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const CartItems = ({ item }: { item: CartItem }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between items-center w-full gap-1 self-start text-sm">
        <span className="line-clamp-1">{item.product.sellerId}</span>
        <Badge>
          {item.product.grade}
        </Badge>
      </div>
      <CartItemActions item={item} />
    </div>
  );
};

export const CartSheet = () => {
  const { cartItems, cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Cart {cartCount > 0 && `(${cartCount})`}</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount > 0 && (
          <div className="flex flex-1 flex-col gap-5 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5 pr-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="space-y-3">
                    <CartItems item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        {cartCount > 0 && <Button>Checkout</Button>}
      </SheetContent>
    </Sheet>
  );
};

export const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="w-full h-12" />
    ))}
  </div>
);
