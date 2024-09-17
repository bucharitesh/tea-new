"use client";

import { useSearchParams } from "next/navigation";
import Cart from "./cart";
import ProductPage from "./products";

const PageClient = () => {
  const searchParams = useSearchParams();

  return (
    <div>
      {!searchParams.get("tab") && <ProductPage />}
      {searchParams.get("tab") === "cart" && <Cart />}
    </div>
  );
};

export default PageClient;
