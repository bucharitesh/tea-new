"use client";

import { Shell } from "./shell";
import { AppTabs } from "./app-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CartSheet } from "@/cart/cart-components";
// import { UserNav } from "./user-nav";

export function AppHeader() {
  return (
    // TODO: discuss amount of top-3 and top-6
    <header className="sticky top-2 z-50 w-full border-border">
      <Shell className="bg-background/70 px-3 py-3 backdrop-blur-lg md:px-6 md:py-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="relative">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="absolute inset-0">{/* <UserNav /> */}</div>
            </div>
            <CartSheet />
          </div>
        </div>
        <AppTabs />
      </Shell>
    </header>
  );
}
