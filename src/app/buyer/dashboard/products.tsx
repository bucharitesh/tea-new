"use client";

import { AddToCartForm } from "@/cart/cart-components";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductTable = ({ data }) => {
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
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
      { Header: "Verification Status", accessor: "verification_status" },
      {
        Header: "Add to Cart",
        accessor: "addToCart",
        Cell: ({ row }) => (
          <AddToCartForm
            product={{
              id: row.original.id,
              sellerId: row.original.sellerId,
              invoiceNo: row.original.invoiceNo,
              grade: row.original.grade,
              pkgs: row.original.pkgs,
              kgPerBag: row.original.kgPerBag,
              sampleUsed: row.original.sampleUsed,
              price: row.original.price,
              division: row.original.division,
              verification_status: row.original.verification_status,
              score: row.original.score,
            }}
          />
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const { globalFilter } = state;

  return (
    <>
      <Input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="mb-4"
      />
      <Table {...getTableProps()}>
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHead
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
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
    </>
  );
};

const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="w-full h-12" />
    ))}
  </div>
);

const ProductPage = () => {
  const session = useSession();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/all?tenant=buyer`,
    fetcher
  );

  if (error)
    return (
      <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-lg">
        Oops! Something went wrong :(
      </div>
    );

  return (
    <div className="flex flex-col w-full text-lg p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Products Listed</h2>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : data && data.length > 0 ? (
        <ProductTable data={data} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductPage;
