import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@prisma/client";
import { useState } from "react";

const OrderActionButton = () => {
  const [orderStatus, setOrderStatus] = useState<string>("PENDING");
  return (
    <Select
      value={orderStatus}
      onValueChange={(value) => setOrderStatus(value as Order["status"])}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Select Status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">PENDING</SelectItem>
        <SelectItem value="PROCESSING">PROCESSING</SelectItem>
        <SelectItem value="SHIPPED">SHIPPED</SelectItem>
        <SelectItem value="DELIVERED">DELIVERED</SelectItem>
        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrderActionButton;
