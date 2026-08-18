"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Store, Calendar } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

const TITLES: Record<string, { title: string; sub: string }> = {
  "/":               { title: "Operations Dashboard",        sub: "Real-time across all 14 Tamil Nadu superstores" },
  "/prescriptions":  { title: "Prescription Verification",    sub: "Review doctor prescription photos & convert to live orders" },
  "/orders":         { title: "Orders & Delivery",            sub: "Online store order dispatch & live rider tracking" },
  "/outlets":        { title: "Retail Outlets",               sub: "Statewide superstore network directory & management" },
  "/inventory":      { title: "Stock Management",             sub: "Master medicine catalog & warehouse batch control" },
  "/coupons":        { title: "Coupons & Discounts",          sub: "Create promo codes, minimum spend thresholds & campaign rules" },
  "/faculty":        { title: "Outlet Staff Logins",          sub: "Manage outlet admin & delivery credentials per branch" },
  "/employees":      { title: "Outlet Staff Logins",          sub: "Manage outlet admin & delivery credentials per branch" },
  "/customers":      { title: "Patients & Customers",         sub: "Patient health IDs & clinical history index" },
  "/finance":        { title: "Finance & GST Audit",          sub: "Daily branch revenue settlements & GSTR-1 filings" },
  "/profile":        { title: "My Profile",                   sub: "Super Admin credentials & platform security" },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { pendingRxCount, lowStockCount, selectedOutlet, setSelectedOutlet, outlets } = useAdmin();

  let meta = TITLES[pathname];
  if (!meta) {
    if (pathname.startsWith("/customers/")) {
      meta = { title: "Patient Medical & Order History", sub: "Comprehensive clinical records & past dispensing" };
    } else if (pathname.startsWith("/outlets/")) {
      meta = { title: "Superstore Branch Operations & Analytics", sub: "Branch financial metrics, live orders & on-duty staff" };
    } else {
      meta = { title: "Admin Console", sub: "SGN Pharmacy Enterprise Management" };
    }
  }

  const alertCount = pendingRxCount + (lowStockCount > 0 ? 1 : 0);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="topbar">
      {/* Left */}
      <div className="topbar-left">
        <span className="topbar-breadcrumb">
          SGN Enterprise / <span>{meta.title}</span>
        </span>
        <h1 className="topbar-title">{meta.title}</h1>
      </div>

      {/* Right */}
      <div className="topbar-right">
        {/* Outlet selector */}
        <div className="topbar-outlet-select">
          <Store style={{ width: 14, height: 14, color: "var(--primary)", flexShrink: 0 }} />
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
          >
            <option value="ALL_TN">All 14 Outlets (TN)</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name.replace("SGN Superstore - ", "")}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts */}
        <button className="topbar-icon-btn" title={`${alertCount} pending verifications & alerts`}>
          <Bell style={{ width: 16, height: 16 }} />
          {alertCount > 0 && <span className="topbar-badge">{alertCount}</span>}
        </button>

        {/* Date chip */}
        <div className="topbar-date">
          <Calendar style={{ width: 13, height: 13 }} />
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
}
