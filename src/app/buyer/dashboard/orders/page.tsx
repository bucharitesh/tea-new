import { Header } from "@/components/layout/header";
import PageClient from "./pageClient";

const Page = () => {
  return (
    <div className="flex flex-col p-8 gap-4">
      <Header
        title="My Orders"
        description="View your orders here."
      />
      <PageClient />
    </div>
  );
};

export default Page;
