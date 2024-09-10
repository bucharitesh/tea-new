import { Header } from "@/components/layout/buyer/header";
import ProductPage from "./products";

const Page = () => {
  return (
    <div>
      <Header title="Live now" description="Live Tea Offerings right now." />
      <ProductPage />
    </div>
  );
};

export default Page;
