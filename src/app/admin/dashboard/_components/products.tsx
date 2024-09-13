"use client";

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
import { useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import useSWR from "swr";
import EditProductForm from "./edit-product-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@prisma/client";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductTable = ({ data, mutate }) => {
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
        className="mb-4 w-1/4"
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
                      {cell.getCellProps().key.split("_")[
                        cell.getCellProps().key.split("_").length - 1
                      ] === "status" ? (
                        <EditProductForm productData={row.original} mutate={mutate} />
                      ) : (
                        cell.render("Cell")
                      )}
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

  const [statusFilter, setStatusFilter] = useState<Product["verification_status"] | "ALL">(
    "PENDING"
  );
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/all?tenant=admin&filter=${statusFilter}`,
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

      <div className="w-1/4 mb-2">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as Product["verification_status"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="VERIFIED">VERIFIED</SelectItem>
            <SelectItem value="REJECTED">REJECTED</SelectItem>
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : data && data.length > 0 ? (
        <ProductTable data={data} mutate={mutate} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductPage;