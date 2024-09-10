import PageClient from "./pageClient";

const Page = () => {
  return (
    <div className="flex flex-col p-8 gap-4">
      <span className="font-bold text-xl">Seller Dashboard</span>
      <hr />
      <div className="h-full w-full relative">
        <PageClient />
      </div>
    </div>
  );
};

export default Page;
