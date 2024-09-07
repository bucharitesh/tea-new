"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { mutate } from "swr";

type ProductFormData = {
  invoiceNo: number;
  pkgs: number;
  kgPerBag: number;
  sampleUsed: number;
  price: number;
  division: boolean;
};

type ProductModalProps = {
  product?: ProductFormData & { id: string };
  onUpdate?: () => void;
};

export function ProductModal({ product, onUpdate }: ProductModalProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: product || {},
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const url = isEditing ? `/api/products/${product.id}` : "/api/products/create";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setOpen(false);
        reset();
        // Refetch the product list
        mutate("/api/products/all");
        if (onUpdate) onUpdate();
      } else {
        console.error(`Failed to ${isEditing ? "update" : "create"} product`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} product:`,
        error
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "outline" : "default"}>
          {isEditing ? "Edit" : "Create Product"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            {...register("invoiceNo", {
              required: "Invoice number is required",
            })}
            type="number"
            placeholder="Invoice No"
            disabled={isEditing}
          />
          {errors.invoiceNo && (
            <p className="text-red-500">{errors.invoiceNo.message}</p>
          )}

          {/* <Select onValueChange={(value) => register("grade").onChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
            </SelectContent>
          </Select> */}

          <Input
            {...register("pkgs", {
              required: "Number of packages is required",
            })}
            type="number"
            placeholder="Packages"
          />
          {errors.pkgs && <p className="text-red-500">{errors.pkgs.message}</p>}

          <Input
            {...register("kgPerBag", { required: "Kg per bag is required" })}
            type="number"
            step="0.01"
            placeholder="Kg Per Bag"
          />
          {errors.kgPerBag && (
            <p className="text-red-500">{errors.kgPerBag.message}</p>
          )}

          <Input
            {...register("sampleUsed", { required: "Sample used is required" })}
            type="number"
            step="0.01"
            placeholder="Sample Used"
          />
          {errors.sampleUsed && (
            <p className="text-red-500">{errors.sampleUsed.message}</p>
          )}

          <Input
            {...register("price", { required: "Price is required" })}
            type="number"
            step="0.01"
            placeholder="Price"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}

          <div className="flex items-center space-x-2">
            <Input {...register("division")} type="checkbox" id="division" />
            <label htmlFor="division">Division</label>
          </div>

          <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
