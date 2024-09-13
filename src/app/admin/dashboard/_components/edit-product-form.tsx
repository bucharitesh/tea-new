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
import { useRouter } from "next/navigation";
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

const scoreSchema = z.object({
  appearance: numberSchema.pipe(z.number().min(1).max(10).optional()),
  taste: numberSchema.pipe(z.number().min(1).max(10).optional()),
  liquor: numberSchema.pipe(z.number().min(1).max(10).optional()),
  infusion: numberSchema.pipe(z.number().min(1).max(10).optional()),
  grading: numberSchema.pipe(z.number().min(1).max(10).optional()),
});

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
  score: scoreSchema,
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProductForm = ({ productData, mutate }: { productData: any; mutate: any; }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      invoiceNo: productData?.invoiceNo,
      grade: productData?.grade,
      pkgs: productData?.pkgs,
      kgPerBag: productData?.kgPerBag,
      sampleUsed: productData?.sampleUsed,
      price: productData?.price,
      division: productData?.division,
      verification_status: productData?.verification_status,
      score: productData?.score ?? null,
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

            if (key === "score" && value) {
              return [
                key,
                Object.fromEntries(
                  Object.entries(value).map(([scoreKey, scoreValue]) => [
                    scoreKey,
                    scoreValue !== undefined
                      ? parseFloat(scoreValue as string)
                      : undefined,
                  ])
                ),
              ];
            }
            return [key, value];
          })
          .filter(([_, v]) => v !== undefined)
      );

      const res = await fetch("/api/products/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId: productData?.sellerId, ...cleanedValues }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product updated successfully!");
        setOpen(false);
        form.reset();
        router.refresh();
        mutate();
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred while updating the product");
    }
  };
  if (!productData) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Verify</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                name="verification_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="VERIFIED">Verified</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Score</h3>
              <div className="grid grid-cols-3 gap-4">
                {["appearance", "taste", "liquor", "infusion", "grading"].map(
                  (scoreField) => (
                    <FormField
                      key={scoreField}
                      control={form.control}
                      name={`score.${scoreField}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {scoreField.charAt(0).toUpperCase() +
                              scoreField.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductForm;
