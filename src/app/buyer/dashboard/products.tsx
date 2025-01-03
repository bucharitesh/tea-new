"use client";

import { AddToCartForm } from "@/cart/cart-components";
import PaginationPages from "@/components/layout/paginationPages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
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
import { getAverageScore } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductTable = ({ data, currentPage, setCurrentPage, pages }) => {
  const columns = useMemo(
    () => [
      { Header: "Lot No.", accessor: "lotNo" },
      { Header: "Mark", accessor: "mark" },
      { Header: "Invoice No", accessor: "invoiceNo" },
      { Header: "Grade", accessor: "grade" },
      { Header: "Packages", accessor: "pkgs" },
      { Header: "Kg Per Bag", accessor: "kgPerBag" },
      {
        Header: "Sample Used",
        accessor: "sampleUsed",
        Cell: ({ value }) => `${value} Kg`,
      },
      {
        Header: "Net Weight",
        accessor: "netWeight",
        Cell: ({ row }) =>
          `${row.original.pkgs * row.original.kgPerBag - row.original.sampleUsed} Kg`,
      },
      {
        Header: "Score",
        accessor: "score",
        Cell: ({ value }) => (value ? <ScoreAnalysis score={value} /> : "N/A"),
      },
      { Header: "Price per Kg", accessor: "price" },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ row }) =>
          `₹${(row.original.price * (row.original.pkgs * row.original.kgPerBag - row.original.sampleUsed)).toFixed(2)}`,
      },
      {
        Header: "Action",
        accessor: "action",
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns, data, initialState: { pageIndex: 0 } },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

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

const ProductPage = () => {
  const [statusFilter, setStatusFilter] = useState<Product["grade"] | "ALL">(
    "ALL"
  );
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/all?tenant=buyer&filter=${statusFilter}&search=${search}&page=${currentPage}&pageSize=10`,
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
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <ProductTable
          data={data.data}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pages={data.pages}
        />
      )}
    </div>
  );
};

const ScoreAnalysis = ({ score }) => {
  const [open, setOpen] = useState(false);
  const categories = {
    appearance: "Appearance",
    taste: "Taste",
    liquor: "Liquor",
    infusion: "Infusion",
    grading: "Grading",
  };

  // Calculate average score (each category is out of 10)
  const averageScore =
    ((score.appearance +
      score.taste +
      score.liquor +
      score.infusion +
      score.grading) /
      50) *
    10;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="cursor-help underline border-dotted"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {averageScore.toFixed(1)}/10
      </PopoverTrigger>
      <PopoverContent
        className="w-[250px] p-4"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="space-y-3">
          {Object.entries(categories).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{score[key]}/10</span>
              </div>
              <Progress value={(score[key] / 10) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductPage;
