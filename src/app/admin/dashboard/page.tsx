import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyerTable } from "./_components/buyer-table";
import { SellerTable } from "./_components/seller-table";

export default function AdminDashboard() {
  return (
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
  );
}
