import { Header } from "@/components/layout/header";
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
