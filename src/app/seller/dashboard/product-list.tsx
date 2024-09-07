"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductModal } from "./product-modal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductList() {
  const [grade, setGrade] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const {
    data: products,
    error,
    mutate,
  } = useSWR(
    `/api/products/all?grade=${grade}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`,
    fetcher
  );

  if (error) return <div>Failed to load products</div>;
  if (!products) return <div>Loading...</div>;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <Input
          className="w-[300px]"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={(value) => setGrade(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Grade A</SelectItem>
            <SelectItem value="B">Grade B</SelectItem>
            <SelectItem value="C">Grade C</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="w-[150px]"
          placeholder="Min Price"
          type="number"
          value={priceRange.min}
          onChange={(e) =>
            setPriceRange({ ...priceRange, min: e.target.value })
          }
        />
        <Input
          className="w-[150px]"
          placeholder="Max Price"
          type="number"
          value={priceRange.max}
          onChange={(e) =>
            setPriceRange({ ...priceRange, max: e.target.value })
          }
        />
        <Button onClick={() => mutate()}>Apply Filters</Button>
      </div>
      <div className="mb-4">
        <ProductModal onUpdate={mutate} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("invoiceNo")}>
              Invoice No
            </TableHead>
            <TableHead onClick={() => handleSort("grade")}>Grade</TableHead>
            <TableHead onClick={() => handleSort("pkgs")}>Packages</TableHead>
            <TableHead onClick={() => handleSort("price")}>Price</TableHead>
            <TableHead onClick={() => handleSort("verification_status")}>
              Verification Status
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.invoiceNo}</TableCell>
              <TableCell>{product.grade}</TableCell>
              <TableCell>{product.pkgs}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.verification_status}</TableCell>
              <TableCell>
                <ProductModal product={product} onUpdate={mutate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
