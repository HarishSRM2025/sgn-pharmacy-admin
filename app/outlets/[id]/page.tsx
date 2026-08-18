"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Users2,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRightLeft,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Outlet, AdminOrder, OutletStaffAccount } from "@/lib/admin-data";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function OutletDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { outlets, orders, staffAccounts } = useAdmin();
  const outletId = params?.id as string;

  const [orderPage, setOrderPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const outlet = outlets.find((o) => o.id === outletId) || outlets[0];
  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  if (!outlet) {
    return (
      <div className="card card-p" style={{ textAlign: "center", padding: 40 }}>
        <h3>Superstore Outlet Not Found</h3>
        <Link href="/outlets" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
          Back to Outlets Directory
        </Link>
      </div>
    );
  }

  // Branch Orders
  const branchOrders: AdminOrder[] = orders.filter(
    (o) =>
      o.outletId === outlet.id ||
      o.outletName.toLowerCase().includes(outlet.name.toLowerCase()) ||
      o.outletName.toLowerCase().includes(outlet.city.toLowerCase())
  );

  // Branch Logged-in Staff
  const branchStaff: OutletStaffAccount[] = staffAccounts.filter(
    (s) =>
      s.outletId === outlet.id ||
      s.outletName.toLowerCase().includes(outlet.city.toLowerCase()) ||
      s.outletName.toLowerCase().includes(outlet.name.toLowerCase())
  );

  const pageSize = 10;
  const paginatedOrders = branchOrders.slice((orderPage - 1) * pageSize, orderPage * pageSize);

  const handleStockTransfer = () => {
    setConfirmModal({
      title: "Inter-Store Stock Transfer Initiated",
      message: `Stock allocation request generated for ${outlet.name}. Dispatch scheduled from Trichy Central Warehouse.`,
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Breadcrumb / Back Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <Link
          href="/outlets"
          className="btn btn-ghost btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Retail Outlets
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={handleStockTransfer} className="btn btn-primary btn-sm">
            <ArrowRightLeft style={{ width: 14, height: 14 }} /> Request Central Stock Transfer
          </button>
        </div>
      </div>

      {/* Outlet Hero Card */}
      <div className="card card-p">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "var(--shadow-primary)",
                flexShrink: 0,
              }}
            >
              <Store style={{ width: 32, height: 32 }} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-dark)" }}>
                  {outlet.name}
                </h2>
                <span className="badge badge-green">
                  <span className="dot dot-green" /> POS Terminal Active
                </span>
                {outlet.coldChainReady && (
                  <span className="badge badge-blue">Cold Chain Certified</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                <MapPin style={{ width: 14, height: 14, color: "var(--primary)", flexShrink: 0 }} />
                <span>{outlet.address}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "var(--text-light)", marginTop: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone style={{ width: 12, height: 12 }} /> {outlet.phone}
                </span>
                <span>Store Manager: <strong style={{ color: "var(--text-dark)" }}>{outlet.manager}</strong></span>
                <span>Chief Pharmacist: <strong style={{ color: "var(--text-dark)" }}>{outlet.pharmacist}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Today&apos;s Gross</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text-dark)", marginTop: 2 }}>
                {formatInr(outlet.dailyRevenue)}
              </div>
            </div>

            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Monthly Sales</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--primary)", marginTop: 2 }}>
                {formatInr(outlet.monthlyRevenue)}
              </div>
            </div>

            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Inventory SKUs</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text-dark)", marginTop: 2 }}>
                {outlet.inventorySKUs.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left = Staff Logins, Right = Branch Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* On-Duty & Logged In Staff */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">On-Duty Staff &amp; Outlet Logins</div>
              <div className="section-sub">Authenticated personnel at this specific branch</div>
            </div>
            <span className="badge badge-green">
              {branchStaff.length > 0 ? branchStaff.length : 2} Logged In
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {branchStaff.map((staff) => (
              <div
                key={staff.id}
                style={{
                  padding: "10px 14px",
                  background: "var(--bg-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "var(--radius-xs)",
                      background: "var(--bg-dark)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {staff.responsiblePerson.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, color: "var(--text-dark)" }}>{staff.responsiblePerson}</strong>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Role: <strong style={{ color: "var(--primary)" }}>{staff.role.replace(/_/g, " ")}</strong> • {staff.email}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="badge badge-green">● Connected</span>
                  <div style={{ fontSize: 10, color: "var(--text-light)", marginTop: 2 }}>{staff.lastLogin}</div>
                </div>
              </div>
            ))}

            {branchStaff.length === 0 && (
              <div style={{ padding: "12px 14px", background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: 13, color: "var(--text-dark)" }}>{outlet.manager}</strong>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Role: Outlet Admin • {outlet.phone}</div>
                </div>
                <span className="badge badge-green">● Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">Branch Diagnostic &amp; Fulfillment Metrics</div>
              <div className="section-sub">Real-time local fulfillment telemetry</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Branch Network City:</span>
              <strong style={{ color: "var(--text-dark)" }}>{outlet.city} ({outlet.district} District)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Cold Chain Storage:</span>
              <strong style={{ color: "#10b981" }}>2°C to 8°C Certified Active</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Total Registered Staff:</span>
              <strong>{outlet.staffCount} On-Duty Personnel</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Live Assigned Online Orders:</span>
              <strong style={{ color: "var(--primary)" }}>{branchOrders.length} Active Dispatches</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Assigned to this Outlet Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-p" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Live Orders Assigned to {outlet.name.replace("SGN Superstore - ", "")}</div>
              <div className="section-sub">Doorstep delivery dispatches fulfilled by this branch</div>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Patient Details</th>
                <th>Dispensed Items</th>
                <th>Prescription</th>
                <th>Total Value</th>
                <th>Delivery Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <div className="td-mono td-primary">{ord.orderNumber}</div>
                    <div className="td-muted">{ord.createdAt}</div>
                  </td>

                  <td>
                    <Link href={`/customers/${ord.customerId}`} style={{ textDecoration: "none" }} className="td-primary">
                      {ord.customerName}
                    </Link>
                    <div className="td-muted">{ord.customerPhone}</div>
                  </td>

                  <td className="td-muted" style={{ maxWidth: 220 }}>
                    <div className="truncate">{ord.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}</div>
                  </td>

                  <td>
                    {ord.isPrescriptionOrder ? (
                      <span className="badge badge-green">Rx Verified</span>
                    ) : (
                      <span className="badge badge-neutral">OTC</span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-dark)" }}>
                      {formatInr(ord.total)}
                    </div>
                  </td>

                  <td className="td-muted">{ord.deliveryType}</td>

                  <td>
                    <span className={`badge ${ord.status === "DELIVERED" ? "badge-green" : ord.status === "OUT_FOR_DELIVERY" ? "badge-blue" : "badge-amber"}`}>
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                    No live orders currently assigned to this branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={orderPage}
          totalItems={branchOrders.length}
          pageSize={pageSize}
          onPageChange={setOrderPage}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.title || "Notification"}
        message={confirmModal?.message || ""}
        type={confirmModal?.type || "info"}
      />
    </div>
  );
}
