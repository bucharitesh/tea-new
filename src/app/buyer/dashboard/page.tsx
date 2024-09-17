import { Header } from "@/components/layout/header";
import ProductPage from "./products";
import PageClient from "./pageClient";

const Page = () => {
  return (
    <div>
      <Header title="Live now" description="Live Tea Offerings right now." />
      <PageClient />
    </div>
  );
};

export default Page;
