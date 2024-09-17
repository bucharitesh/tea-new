'use client';

import { TableSkeleton } from "@/cart/cart-components";
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
import { useMemo } from "react";
import { useTable } from "react-table";
import { toast } from "sonner";

const Cart = () => {
  const { placeOrder, cartItems, cartCount } = useCart();

  const { data: session } = useSession();

  const columnData = cartItems.map((each) => ({
    ...each.product,
    quantity: each.quantity,
  }));

  const columns = useMemo(
    () => [
      { Header: "Seller ID", accessor: "sellerId" },
      { Header: "Invoice No", accessor: "invoiceNo" },
      { Header: "Grade", accessor: "grade" },
      {
        Header: "Score",
        accessor: "score",
        Cell: ({ value }) => {
          const { appearance, taste, liquor, infusion, grading } = value;
          return (
            (appearance + liquor + taste + infusion + grading) /
            50
          ).toFixed(2);
        },
      },
      { Header: "Packages", accessor: "pkgs" },
      { Header: "Kg Per Bag", accessor: "kgPerBag" },
      { Header: "Sample Used", accessor: "sampleUsed" },
      { Header: "Price", accessor: "price" },
      {
        Header: "Division",
        accessor: "division",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
    ],
    []
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

  return (
    <div className="flex flex-col w-full text-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
      </div>
      {!columnData ? (
        <TableSkeleton />
      ) : (
        <>
          <Table {...getTableProps()}>
            <TableHeader>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableHead>
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
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <span className="text-black w-full text-sm flex items-center justify-center italic mt-4 grow h-[200px] bg-gray-100 rounded-xl">
              Your cart is empty!
            </span>
          )}
        </>
      )}
      {cartCount > 0 && (
        <Button
          onClick={handlePlaceOrder}
          disabled={cartCount === 0}
          className="w-1/5 self-end mt-6"
        >
          Place Order
        </Button>
      )}
    </div>
  );
};

export default Cart;
