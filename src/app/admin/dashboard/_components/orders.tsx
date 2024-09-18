"use client"

import React, { useMemo, useState } from 'react';
import useSWR from "swr";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PaginationPages from "@/components/layout/paginationPages";
import { OrderStatus } from '@/cart/cart-context';

const fetcher = (url) => fetch(url).then((res) => res.json());

const OrdersTable = ({ data, currentPage, setCurrentPage, pages }) => {
  const columns = useMemo(
    () => [
      { Header: "Order ID", accessor: "id" },
      { Header: "Buyer ID", accessor: "userId" },
      { Header: "Total Amount", accessor: "totalAmount", Cell: ({ value }) => `$${value.toFixed(2)}` },
      { Header: "Status", accessor: "status" },
      { Header: "Items Count", accessor: "items", Cell: ({ value }) => value.length },
      { Header: "Created At", accessor: "createdAt", Cell: ({ value }) => new Date(value).toLocaleString() },
      { Header: "Updated At", accessor: "updatedAt", Cell: ({ value }) => new Date(value).toLocaleString() },
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
            <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHead key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data || data.length === 0 && (
        <span className="text-black w-full text-sm flex items-center justify-center italic mt-4 grow h-[200px] bg-gray-100 rounded-xl">
          No orders found with the provided filters!
        </span>
      )}
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

const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, error, isLoading } = useSWR(
    `/api/orders/all?status=${statusFilter}&search=${search}&page=${currentPage}&pageSize=10`,
    fetcher
  );

  if (error) return (
    <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-lg">
      Oops! Something went wrong :(
    </div>
  );

  return (
    <div className="flex flex-col w-full text-lg p-8">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Orders Placed</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-1/3">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="PROCESSING">PROCESSING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              <SelectItem value="ALL">ALL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <Input
            placeholder="Search by Order ID or Buyer ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <OrdersTable
          data={data.data}
          pages={data.pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;