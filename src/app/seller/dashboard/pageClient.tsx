"use client";

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
import CreateProductForm from "./form";
import PaginationPages from "@/components/layout/paginationPages";
import { getAverageScore } from "@/lib/utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductTable = ({ data, currentPage, setCurrentPage, pages }) => {
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Seller ID", accessor: "sellerId" },
      { Header: "Invoice No", accessor: "invoiceNo" },
      { Header: "Grade", accessor: "grade" },
      {
        Header: "Score",
        accessor: "score",
        Cell: ({ value }) => getAverageScore(value),
      },
      { Header: "Packages", accessor: "pkgs" },
      { Header: "Kg Per Bag", accessor: "kgPerBag" },
      { Header: "Sample Used", accessor: "sampleUsed" },
      {
        Header: "Total",
        accessor: "total"
      },
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <>
      <Table {...getTableProps()}>
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <TableHead
                  key={column.id}
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
              <TableRow key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id} {...cell.getCellProps()}>
                    {cell.getCellProps().key.split("_")[
                      cell.getCellProps().key.split("_").length - 1
                    ] === "status" && cell.value === "VERIFIED" ? (
                      <p className="text-green-600 font-bold">PRODUCT LIVE</p>
                    ) : (
                      cell.render("Cell")
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data ||
        (data.length === 0 && (
          <span className="text-black w-full text-sm flex items-center justify-center italic mt-4 grow h-[200px] bg-gray-100 rounded-xl">
            No product is listed with the provided filters!
          </span>
        ))}
      <PaginationPages
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
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

const PageClient = () => {
  const session = useSession();
  const [statusFilter, setStatusFilter] = useState<
    Product["verification_status"] | "ALL"
  >("VERIFIED");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/${session?.data?.user?.user_id}?filter=${statusFilter}&search=${search}&page=${currentPage}&pageSize=10`,
    fetcher
  );

  if (error)
    return (
      <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-lg">
        Oops! Something went wrong :(
      </div>
    );

  return (
    <div className="flex flex-col w-full text-lg">
      <div className="flex items-center justify-between mb-4">
        <CreateProductForm sellerId={session?.data?.user?.user_id as string} />
      </div>
      <div className="w-1/2 flex items-center gap-2 mb-4">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as Product["verification_status"])
          }
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
      ) : (
        <ProductTable
          data={data.data}
          pages={data.pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PageClient;
