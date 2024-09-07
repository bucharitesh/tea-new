import { TableCell, TableRow } from "@/components/ui/table";

export function TableSkeleton({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(columns)].map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
