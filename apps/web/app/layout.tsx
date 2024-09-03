import { inter, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import { cn } from "@tea/utils";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(satoshi.variable, inter.variable)}>
      <body>
        <Toaster closeButton className="pointer-events-auto" />
        {children}
      </body>
    </html>
  );
}
