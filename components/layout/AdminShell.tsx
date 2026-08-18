"use client";

import React from "react";
import AdminSidebar, { SidebarProvider } from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="admin-shell">
        {/* Sticky Fixed Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="page-content">
          {/* Sticky Fixed Topbar */}
          <AdminHeader />

          {/* Page Inner Content */}
          <main className="page-inner">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
