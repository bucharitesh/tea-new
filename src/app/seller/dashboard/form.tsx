import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const numberSchema = z
  .union([
    z.string().refine((val) => val === "" || !isNaN(Number(val)), {
      message: "Must be a valid number or empty",
    }),
    z.number(),
  ])
  .transform((val) => (val === "" ? undefined : Number(val)));

const floatSchema = numberSchema.pipe(
  z.number().min(0, "Must be a non-negative number")
);

const productSchema = z.object({
  invoiceNo: numberSchema.pipe(
    z
      .number()
      .int()
      .positive({ message: "Invoice number must be a positive integer" })
      .optional()
  ),
  grade: z.enum(["A", "B", "C"], { required_error: "Grade is required" }),
  pkgs: numberSchema.pipe(
    z
      .number()
      .int()
      .positive({ message: "Packages must be a positive integer" })
      .optional()
  ),
  kgPerBag: floatSchema.optional(),
  sampleUsed: floatSchema.optional(),
  price: floatSchema.optional(),
  division: z.boolean().default(false),
  verification_status: z
    .enum(["PENDING", "VERIFIED", "REJECTED"])
    .default("PENDING"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CreateProductForm = ({ sellerId }: { sellerId: string }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      division: false,
      verification_status: "PENDING",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Convert specific fields to float and remove undefined values
      const cleanedValues = Object.fromEntries(
        Object.entries(values)
          .map(([key, value]) => {
            if (
              ["kgPerBag", "sampleUsed", "price"].includes(key) &&
              value !== undefined
            ) {
              return [key, parseFloat(value as string)];
            }
            return [key, value];
          })
          .filter(([_, v]) => v !== undefined)
      );

      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId, ...cleanedValues }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product created successfully!");
        setOpen(false);
        form.reset();
      } else {
        toast.error(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred while creating the product");
    }
  };

  if (!sellerId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">Create Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pkgs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Packages</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kgPerBag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kg Per Bag</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sampleUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Used</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Division</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
