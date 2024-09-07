// components/SellerTable.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { TableSkeleton } from "./table-skeleton";
import { Modal } from "./modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Seller = {
  id: string;
  businessName: string;
  email: string;
  contactNo: string;
  verification_status: "APPROVED" | "REJECTED" | "INITIALISED";
  address: string;
  pincode: string;
  district: string;
  state: string;
  name: string;
  alternateContactNo: string;
  panNo: string;
  gstNo: string;
  fssaiNo: string;
  tmcoNo: string;
  bankAccountNo: string;
  ifscCode: string;
  nameOfTransport: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SellerTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<Seller["verification_status"]>("INITIALISED");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editedSeller, setEditedSeller] = useState<Seller | null>(null);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [newStatus, setNewStatus] =
    useState<Seller["verification_status"]>("INITIALISED");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/sellers?page=${pagination.pageIndex + 1}&pageSize=${
      pagination.pageSize
    }&search=${debouncedSearchTerm}&status=${statusFilter}`,
    fetcher
  );

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, [statusFilter]);

  const handleStatusChange = (seller: Seller) => {
    setEditedSeller(seller);
    setNewStatus(seller.verification_status);
    setEditedFields(new Set());
    setModalOpen(true);
  };

  const handleInputChange = (field: keyof Seller, value: string) => {
    setEditedSeller((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      setEditedFields((prevFields) => new Set(prevFields).add(field));
      return updated;
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!editedSeller) return;

    try {
      const response = await fetch("/api/sellers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editedSeller.id,
          status: newStatus,
          updatedFields: Object.fromEntries(
            Array.from(editedFields).map((field) => [
              field,
              editedSeller[field as keyof Seller],
            ])
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update seller");
      }

      const updatedSeller = await response.json();

      if (newStatus === "APPROVED" && updatedSeller.password) {
        alert(`Seller approved. Generated password: ${updatedSeller.password}`);
      }

      mutate();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating seller:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const columns: ColumnDef<Seller>[] = [
    {
      accessorKey: "businessName",
      header: "Business Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "contactNo",
      header: "Contact No",
    },
    {
      accessorKey: "verification_status",
      header: "Verification Status",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <Button onClick={() => handleStatusChange(seller)}>Review</Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.sellers ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (error) return <div>Failed to load sellers</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as Seller["verification_status"])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INITIALISED">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={5} rows={10} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} of {data?.totalPages ?? 0}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Review Seller Details"
        onConfirm={handleConfirmStatusChange}
        confirmText="Update Status"
      >
        {editedSeller && (
          <div className="space-y-4 max-h-[90vh] p-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(editedSeller) as Array<keyof Seller>).map(
                (field) => {
                  if (field === "id" || field === "verification_status")
                    return null;
                  return (
                    <div key={field}>
                      <Label
                        htmlFor={field}
                        className={
                          editedFields.has(field)
                            ? "text-blue-600 font-bold"
                            : ""
                        }
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        value={editedSeller[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className={
                          editedFields.has(field) ? "border-blue-600" : ""
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
            <div>
              <Label>Update Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as Seller["verification_status"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
