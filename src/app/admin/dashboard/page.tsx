import Sidebar from "@/components/admin/sidebar"; // Assuming Sidebar is in the components folder
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyerTable } from "./buyer-table";
import { SellerTable } from "./seller-table";

export default function AdminDashboard({
  searchParams,
}: {
  searchParams?: { tab: "user" | "product" | "extra" };
}) {


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      {searchParams?.tab === "user" && (
        <div className="flex-grow p-10">
          <Tabs defaultValue="buyers">
            <TabsList>
              <TabsTrigger value="buyers">Buyers</TabsTrigger>
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
            </TabsList>

            <TabsContent value="buyers">
              <BuyerTable />
            </TabsContent>
            <TabsContent value="sellers">
              <SellerTable />
            </TabsContent>
          </Tabs>
        </div>
      )}
      {searchParams?.tab === "product" && (
        <div className="flex-grow p-10">
          PRODUCTS
        </div>
      )}
      {searchParams?.tab === "extra" && (
        <div className="flex-grow p-10">
          EXTRA
        </div>
      )}
    </div>
  );
}
