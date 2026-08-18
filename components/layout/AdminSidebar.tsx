"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Pill,
  Package,
  Users2,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  FileCheck2,
  KeyRound,
  Tag,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

const NAV = [
  { label: "Dashboard",             href: "/",               icon: LayoutDashboard },
  { label: "Verify Prescriptions",  href: "/prescriptions",  icon: FileCheck2, badgeKey: "pendingRxCount" as const },
  { label: "Orders & Delivery",     href: "/orders",         icon: Package,    badgeKey: "activeOrdersCount" as const },
  { label: "Retail Outlets",        href: "/outlets",        icon: Store,      count: "14" },
  { label: "Stock Management",      href: "/inventory",      icon: Pill,       badgeKey: "lowStockCount" as const },
  { label: "Coupons & Discounts",   href: "/coupons",        icon: Tag },
  { label: "Outlet Staff Logins",   href: "/faculty",        icon: KeyRound },
  { label: "Patients & Customers",  href: "/customers",      icon: Users2 },
  { label: "Finance & GST",         href: "/finance",        icon: TrendingUp },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useContext(SidebarContext);
  const { lowStockCount, pendingRxCount, activeOrdersCount, outlets } = useAdmin();

  const badges: Record<string, number> = {
    lowStockCount,
    pendingRxCount,
    activeOrdersCount,
  };

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight style={{ width: 13, height: 13 }} />
        ) : (
          <ChevronLeft style={{ width: 13, height: 13 }} />
        )}
      </button>

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">SGN Enterprise</span>
            <span className="sidebar-brand-sub">Admin Console</span>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="sidebar-search">
          <div className="sidebar-search-wrap">
            <Search className="sidebar-search-icon" style={{ width: 13, height: 13 }} />
            <input placeholder="Quick search..." />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {!collapsed && (
          <div className="sidebar-section-label">Main Menu</div>
        )}

        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const badgeVal = item.badgeKey ? badges[item.badgeKey] : 0;
          const displayCount = item.href === "/outlets" ? String(outlets.length) : item.count;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${isActive ? " active" : ""}`}
            >
              <Icon className="sidebar-link-icon" />
              {!collapsed && (
                <>
                  <span className="sidebar-link-label">{item.label}</span>
                  {badgeVal > 0 && (
                    <span className="sidebar-badge">{badgeVal}</span>
                  )}
                  {displayCount && !badgeVal && (
                    <span className="sidebar-count">{displayCount}</span>
                  )}
                </>
              )}
              {collapsed && (
                <span className="sidebar-link-tooltip">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Account group */}
        {!collapsed && (
          <div className="sidebar-section-label" style={{ marginTop: 16 }}>
            Account
          </div>
        )}
        <Link
          href="/profile"
          className={`sidebar-link${pathname === "/profile" ? " active" : ""}`}
        >
          <User className="sidebar-link-icon" />
          {!collapsed && <span className="sidebar-link-label">My Profile</span>}
          {collapsed && <span className="sidebar-link-tooltip">My Profile</span>}
        </Link>
      </nav>

      {/* User footer */}
      <div className="sidebar-user">
        {collapsed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Link href="/profile">
              <div className="sidebar-avatar" title="Profile">
                AB
              </div>
            </Link>
            <button className="sidebar-signout-btn" title="Sign Out" style={{ padding: "7px" }}>
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ) : (
          <>
            <Link href="/profile" className="sidebar-user-inner" style={{ textDecoration: "none" }}>
              <div className="sidebar-avatar">AB</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <span className="sidebar-user-name">Dr. A. Balasubramanian</span>
                <span className="sidebar-user-role">Super Admin</span>
              </div>
            </Link>
            <div className="sidebar-user-actions">
              <button className="sidebar-signout-btn">
                <LogOut style={{ width: 13, height: 13 }} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
