"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  Eye,
  X,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  FileCheck2,
  FileText,
  Check,
  Filter,
  Store,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminOrder } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

const STATUSES = ["ALL", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const RX_FILTERS = ["ALL", "RX_ORDERS", "OTC_ORDERS"];

export default function OrdersPage() {
  const { orders, outlets, updateOrderStatus } = useAdmin();
  const [outletFilter, setOutletFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rxFilter, setRxFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  const filtered = orders.filter((o) => {
    if (outletFilter !== "ALL" && o.outletId !== outletFilter) return false;
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (rxFilter === "RX_ORDERS" && !o.isPrescriptionOrder) return false;
    if (rxFilter === "OTC_ORDERS" && o.isPrescriptionOrder) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.outletName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const inTransitCount = orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Active Orders Stream</span>
          <span className="kpi-value">{orders.length}</span>
          <div className="kpi-sub">
            <span>Online App &amp; Verified Rx Dispatches</span>
          </div>
        </div>

        <div className="kpi-card accent-amber">
          <span className="kpi-label">Processing in Superstores</span>
          <span className="kpi-value">{processingCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-amber">Awaiting Rider Pick</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Live In-Transit Deliveries</span>
          <span className="kpi-value">{inTransitCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-blue">2-Hour Express</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Delivered &amp; Settled</span>
          <span className="kpi-value">{deliveredCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-green">100% Completed</span>
          </div>
        </div>
      </div>

      {/* Toolbar with Outlet & Rx Filters */}
      <div className="card card-sm" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 260, maxWidth: 380 }}>
          <Search className="input-icon" style={{ width: 14, height: 14 }} />
          <input
            type="text"
            className="input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search order number, patient, mobile, or branch..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Outlet Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0 10px", height: 36 }}>
            <Store style={{ width: 13, height: 13, color: "var(--primary)" }} />
            <select
              value={outletFilter}
              onChange={(e) => {
                setOutletFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, fontWeight: 600, color: "var(--text-dark)", cursor: "pointer", maxWidth: 190 }}
            >
              <option value="ALL">All 14 Superstores</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name.replace("SGN Superstore - ", "")} ({o.city})
                </option>
              ))}
            </select>
          </div>

          {/* Rx vs OTC Filter */}
          <select
            value={rxFilter}
            onChange={(e) => {
              setRxFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input"
            style={{ width: "auto", height: 36, padding: "0 12px", cursor: "pointer" }}
          >
            <option value="ALL">All Orders (Rx + OTC)</option>
            <option value="RX_ORDERS">Prescription Verified Orders</option>
            <option value="OTC_ORDERS">OTC Non-Rx Orders</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input"
            style={{ width: "auto", height: 36, padding: "0 12px", cursor: "pointer" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Statuses" : s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient Details</th>
                <th>Fulfilling Superstore</th>
                <th>Prescribed / OTC Items</th>
                <th>Rx Origin</th>
                <th>Payment</th>
                <th>Total Value</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: "right" }}>Dispatch Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <div className="td-mono td-primary">{ord.orderNumber}</div>
                    <div className="td-muted">{ord.createdAt}</div>
                  </td>

                  <td>
                    <Link
                      href={`/customers/${ord.customerId}`}
                      style={{ textDecoration: "none" }}
                      className="td-primary"
                    >
                      {ord.customerName}
                    </Link>
                    <div className="td-muted">{ord.customerPhone}</div>
                  </td>

                  <td className="td-muted">
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>
                      {ord.outletName.replace("SGN Superstore - ", "")}
                    </div>
                  </td>

                  <td className="td-muted" style={{ maxWidth: 220 }}>
                    <div className="truncate">{ord.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}</div>
                  </td>

                  <td>
                    {ord.isPrescriptionOrder ? (
                      <span className="badge badge-green">
                        ✓ Verified ({ord.rxRefId || "Doctor Rx"})
                      </span>
                    ) : (
                      <span className="badge badge-neutral">OTC Order</span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{ord.paymentMethod}</div>
                    <div style={{ fontSize: 11, color: ord.paymentStatus === "PAID" ? "#10b981" : "#f59e0b", fontWeight: 700 }}>
                      {ord.paymentStatus}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-dark)" }}>
                      {formatInr(ord.total)}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        ord.status === "DELIVERED"
                          ? "badge-green"
                          : ord.status === "OUT_FOR_DELIVERY"
                          ? "badge-blue"
                          : ord.status === "PROCESSING"
                          ? "badge-amber"
                          : "badge-neutral"
                      }`}
                    >
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setSelectedOrder(ord)} className="btn btn-ghost btn-xs">
                        <Eye style={{ width: 12, height: 12 }} /> View
                      </button>

                      {ord.status === "PROCESSING" && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, "OUT_FOR_DELIVERY");
                            setConfirmModal({
                              title: "Express Rider Dispatched!",
                              message: `Order ${ord.orderNumber} has been assigned to Express Rider for 2-hour doorstep delivery.`,
                              type: "success",
                            });
                          }}
                          className="btn btn-primary btn-xs"
                        >
                          <Truck style={{ width: 12, height: 12 }} /> Dispatch
                        </button>
                      )}

                      {ord.status === "OUT_FOR_DELIVERY" && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, "DELIVERED");
                            setConfirmModal({
                              title: "Order Delivered!",
                              message: `Order ${ord.orderNumber} marked as successfully delivered and settled.`,
                              type: "success",
                            });
                          }}
                          className="btn btn-ghost btn-xs"
                          style={{ borderColor: "#a7f3d0", color: "#065f46", background: "#ecfdf5" }}
                        >
                          <CheckCircle2 style={{ width: 12, height: 12 }} /> Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                    No matching orders found.
                  </td>
                </tr>
              )}
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

      {/* Global Full-App Viewport Order Details Modal */}
      {selectedOrder && (
        <ModalPortal>
          <div className="overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>
                    Live Order Inspection
                  </span>
                  <h3 className="modal-title">{selectedOrder.orderNumber}</h3>
                  <p className="modal-sub">Placed on {selectedOrder.createdAt} • Fulfilling: {selectedOrder.outletName}</p>
                </div>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Customer Details */}
                <div style={{ background: "var(--bg-alt)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: 13, color: "var(--text-dark)" }}>{selectedOrder.customerName}</strong>
                    <Link href={`/customers/${selectedOrder.customerId}`} style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>
                      View Patient History →
                    </Link>
                  </div>
                  <div style={{ color: "var(--text-muted)", marginTop: 2 }}>📞 {selectedOrder.customerPhone}</div>
                  <div style={{ color: "var(--text-muted)", marginTop: 2 }}>📍 {selectedOrder.customerAddress}</div>
                  <div style={{ color: "var(--text-light)", marginTop: 4, textTransform: "uppercase", fontSize: 10, fontWeight: 700 }}>
                    Mode: {selectedOrder.deliveryType} • Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)", marginBottom: 8 }}>
                    Dispensed Medicine Formulations
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                        <span>{item.name} × {item.qty}</span>
                        <strong>₹{item.price * item.qty}</strong>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, paddingTop: 6 }}>
                      <span>Gross Total</span>
                      <span style={{ color: "var(--primary)" }}>{formatInr(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
                {selectedOrder.status === "PROCESSING" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "OUT_FOR_DELIVERY");
                      setSelectedOrder(null);
                      setConfirmModal({
                        title: "Express Rider Dispatched!",
                        message: `Order ${selectedOrder.orderNumber} dispatched for 2-hour express delivery.`,
                        type: "success",
                      });
                    }}
                  >
                    <Truck style={{ width: 14, height: 14 }} /> Dispatch 2-Hour Express Rider
                  </button>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Confirmation & Notification Modal */}
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
