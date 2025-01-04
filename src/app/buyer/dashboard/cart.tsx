"use client";

import { CartItemActions, TableSkeleton } from "@/cart/cart-components";
import { useCart } from "@/cart/cart-context";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { getAverageScore, getOrderTotal } from "@/lib/utils";
import { useMemo } from "react";
import { useTable } from "react-table";
import { toast } from "sonner";
import { X } from "lucide-react";

const Cart = () => {
  const { placeOrder, cartItems, cartCount, removeFromCart } = useCart();

  const { data: session } = useSession();

  const columnData = cartItems.map((each) => ({
    ...each.product,
    quantity: each.quantity,
  }));

  console.log("cart", columnData)

  const columns = useMemo(
    () => [
      { Header: "Mark", accessor: "mark" },
      { Header: "Invoice No", accessor: "invoiceNo" },
      { Header: "Grade", accessor: "grade" },
      { Header: "Packages", accessor: "pkgs" },
      { Header: "Kg Per Bag", accessor: "kgPerBag" },
      { Header: "Sample Used", accessor: "sampleUsed" },
      {
        Header: "Net Weight",
        accessor: "netWeight",
        Cell: ({ row }) =>
          `${row.original.pkgs * row.original.kgPerBag - row.original.sampleUsed} Kg`,
      },
      { Header: "Price per Kg", accessor: "price" },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ row }) =>
          `₹${(row.original.pkgs * row.original.kgPerBag * row.original.price).toFixed(2)}`,
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => removeFromCart(row.original.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Remove from cart"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        ),
      },
    ],
    [removeFromCart]
  );

  const handlePlaceOrder = async () => {
    if (!session?.user?.user_id) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (cartCount === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      await placeOrder(session?.user?.user_id);
      toast.success("Your order has been placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: columnData });

  const subtotal = useMemo(() => {
    if (!cartItems?.length) return 0;
    return cartItems.reduce(
      (total, item) =>
        total + item.product.price * item.product.pkgs * item.product.kgPerBag,
      0
    );
  }, [cartItems]);

  const deliveryCharges = cartItems?.length ? 500 : 0;
  const otherCharges = cartItems?.length ? 200 : 0;
  const gstRate = 0.05;
  const gstAmount = cartItems?.length
    ? (subtotal + deliveryCharges + otherCharges) * gstRate
    : 0;
  const totalAmount = subtotal + deliveryCharges + otherCharges + gstAmount;

  return (
    <div className="flex flex-col w-full text-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {!columnData ? (
            <TableSkeleton />
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table {...getTableProps()}>
                  <TableHeader>
                    {headerGroups.map((headerGroup) => (
                      <TableRow
                        key={headerGroup?.id}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => (
                          <TableHead key={column?.id}>
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <TableRow key={row?.id} {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <TableCell
                                key={cell?.id}
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {rows.length === 0 && (
                <span className="text-black w-full text-sm flex items-center justify-center italic mt-4 grow h-[200px] bg-gray-100 rounded-xl">
                  Your cart is empty!
                </span>
              )}
            </>
          )}
        </div>

        <div className="w-[400px] text-xs h-fit sticky top-4">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges:</span>
                <span>₹{deliveryCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Charges:</span>
                <span>₹{otherCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (5%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-3 text-lg">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={cartCount === 0}
              className="w-full mt-6"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
