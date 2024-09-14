"use client";

import { AddToCartForm } from "@/cart/cart-components";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductTable = ({ data }) => {
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
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <>
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
      {rows.length === 0 && (
        <span className="text-black w-full text-sm flex items-center justify-center italic mt-4 grow h-[200px] bg-gray-100 rounded-xl">
          No product is listed with the provided filters!
        </span>
      )}
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
  const [statusFilter, setStatusFilter] = useState<Product["grade"] | "ALL">(
    "ALL"
  );
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/all?tenant=buyer&filter=${statusFilter}`,
    fetcher
  );

  if (error)
    return (
      <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-lg">
        Oops! Something went wrong :(
      </div>
    );

  return (
    <div className="flex flex-col w-full text-lg py-8">
      <div className="w-1/2 flex items-center gap-2 mb-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as Product["grade"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? <TableSkeleton /> : <ProductTable data={data} />}
    </div>
  );
};

export default ProductPage;
