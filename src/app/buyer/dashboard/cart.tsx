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
import { useMemo } from "react";
import { useTable } from "react-table";

const Cart = () => {
  const { cartItems, cartCount } = useCart();

  const columnData = cartItems.map((each) => ({
    ...each.product,
    quantity: each.quantity,
  }));
  console.log("data", columnData);

  const columns = useMemo(
    () => [
      { Header: "Seller ID", accessor: "sellerId" },
      { Header: "Invoice No", accessor: "invoiceNo" },
      { Header: "Grade", accessor: "grade" },
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: columnData });

  return (
    <div className="flex flex-col w-full text-lg p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Shopping Cart</h2>
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
      {cartCount > 0 && <Button className="w-1/5 self-center mt-6">Place Order</Button>}
    </div>
  );
};

export default Cart;
