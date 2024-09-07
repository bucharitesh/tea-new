import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyerTable } from "./buyer-table";
import { SellerTable } from "./seller-table";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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
  );
}
