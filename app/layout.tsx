import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/lib/admin-context";
import AdminShell from "@/components/layout/AdminShell";

export const metadata: Metadata = {
  title: "SGN Pharmacy — Enterprise Admin",
  description: "Multi-store pharmacy operations: inventory, orders, diagnostics, HR & financials across Tamil Nadu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <AdminShell>{children}</AdminShell>
        </AdminProvider>
      </body>
    </html>
  );
}
