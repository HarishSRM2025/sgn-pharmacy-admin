"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users2,
  Search,
  Eye,
  Zap,
  Heart,
  Phone,
  MapPin,
  ShoppingBag,
  Wallet,
  X,
  CheckCircle2,
  Package,
  FileText,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { CustomerProfile } from "@/lib/admin-data";
import Pagination from "@/components/ui/Pagination";

export default function CustomersPage() {
  const { customers, orders } = useAdmin();
  const [search, setSearch] = useState("");
  const [onlyRefill, setOnlyRefill] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  const filtered = customers.filter((c) => {
    if (onlyRefill && !c.refillSubscriber) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.healthId.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalSpend = customers.reduce((s, c) => s + c.totalSpend, 0);
  const refillCount = customers.filter((c) => c.refillSubscriber).length;
  const chronicCount = customers.filter((c) => c.chronicCondition).length;

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Master Patient Index</span>
          <span className="kpi-value">{customers.length.toLocaleString()}</span>
          <div className="kpi-sub">
            <span>Verified Digital Health IDs</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Cumulative Patient Spend</span>
          <span className="kpi-value">{formatInr(totalSpend)}</span>
          <div className="kpi-sub">
            <span className="kpi-trend-up">↑ 18.5% YoY</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Auto-Refill Subscribers</span>
          <span className="kpi-value">{refillCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-green">
              <Zap style={{ width: 10, height: 10 }} /> Monthly Care
            </span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <span className="kpi-label">Chronic Conditions Tracked</span>
          <span className="kpi-value">{chronicCount}</span>
          <div className="kpi-sub">
            <span>Hypertension &amp; Diabetic Care</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card card-sm" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 260, maxWidth: 440 }}>
          <Search className="input-icon" style={{ width: 14, height: 14 }} />
          <input
            type="text"
            className="input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search patient name, mobile, city, or Health ID..."
          />
        </div>

        <button
          onClick={() => {
            setOnlyRefill(!onlyRefill);
            setCurrentPage(1);
          }}
          className={`btn btn-sm ${onlyRefill ? "btn-primary" : "btn-ghost"}`}
        >
          <Zap style={{ width: 13, height: 13 }} />
          Auto-Refill Subscribers ({refillCount})
        </button>
      </div>

      {/* Patients Data Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Profile</th>
                <th>SGN Health ID</th>
                <th>Contact &amp; Location</th>
                <th>Chronic Care</th>
                <th>Orders Count</th>
                <th>Total Spend</th>
                <th>Health Wallet</th>
                <th>Auto-Refill</th>
                <th style={{ textAlign: "right" }}>Patient History</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cust) => {
                const custOrdersCount = orders.filter(
                  (o) => o.customerId === cust.id || o.customerPhone === cust.phone
                ).length;

                return (
                  <tr key={cust.id}>
                    <td>
                      <Link
                        href={`/customers/${cust.id}`}
                        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-dark)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {cust.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="td-primary" style={{ cursor: "pointer" }}>{cust.name}</div>
                          <div className="td-muted">Joined {cust.registeredSince}</div>
                        </div>
                      </Link>
                    </td>

                    <td>
                      <span className="badge badge-green" style={{ fontFamily: "monospace" }}>
                        ✓ {cust.healthId}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{cust.phone}</div>
                      <div className="td-muted">{cust.city}</div>
                    </td>

                    <td>
                      {cust.chronicCondition ? (
                        <span className="badge badge-red">{cust.chronicCondition}</span>
                      ) : (
                        <span className="td-muted">—</span>
                      )}
                    </td>

                    <td>
                      <Link href={`/customers/${cust.id}`} className="badge badge-blue" style={{ textDecoration: "none" }}>
                        <Package style={{ width: 10, height: 10 }} /> {custOrdersCount > 0 ? custOrdersCount : cust.totalOrders} Orders
                      </Link>
                    </td>

                    <td>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-dark)" }}>
                        {formatInr(cust.totalSpend)}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#10b981" }}>
                        {formatInr(cust.walletBalance)}
                      </div>
                    </td>

                    <td>
                      {cust.refillSubscriber ? (
                        <span className="badge badge-green">
                          <Zap style={{ width: 10, height: 10 }} /> Active
                        </span>
                      ) : (
                        <span className="td-muted">—</span>
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Link href={`/customers/${cust.id}`} className="btn btn-ghost btn-xs">
                        View Full History <ArrowRight style={{ width: 12, height: 12 }} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Max 10 items/page pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
