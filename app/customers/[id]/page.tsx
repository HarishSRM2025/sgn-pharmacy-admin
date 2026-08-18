"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Zap,
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  FileCheck2,
  Calendar,
  Wallet,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminOrder, PrescriptionVerification } from "@/lib/admin-data";
import Pagination from "@/components/ui/Pagination";

export default function PatientHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { customers, orders, prescriptions } = useAdmin();
  const patientId = params?.id as string;

  const [orderPage, setOrderPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"orders" | "prescriptions" | "clinical">("orders");

  const customer = customers.find((c) => c.id === patientId) || customers[0];
  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  // Get customer orders
  const customerOrders: AdminOrder[] = orders.filter(
    (o) =>
      o.customerId === customer?.id ||
      o.customerPhone === customer?.phone ||
      o.customerName.toLowerCase().includes(customer?.name.toLowerCase() || "")
  );

  // Get customer prescriptions
  const customerRx: PrescriptionVerification[] = prescriptions.filter(
    (p) =>
      p.patientId === customer?.id ||
      p.patientPhone === customer?.phone ||
      p.patientName.toLowerCase().includes(customer?.name.toLowerCase() || "")
  );

  const pageSize = 10;
  const paginatedOrders = customerOrders.slice((orderPage - 1) * pageSize, orderPage * pageSize);

  if (!customer) {
    return (
      <div className="card card-p" style={{ textAlign: "center", padding: 40 }}>
        <h3>Patient Record Not Found</h3>
        <Link href="/customers" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
          Back to Customer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Back Navigation Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/customers"
          className="btn btn-ghost btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Patient Directory
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge badge-green" style={{ fontFamily: "monospace", fontSize: 13, padding: "5px 10px" }}>
            <ShieldCheck style={{ width: 13, height: 13 }} /> SGN Health ID: {customer.healthId}
          </span>
        </div>
      </div>

      {/* Patient Profile Hero Header */}
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
              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-dark)" }}>
                  {customer.name}
                </h2>
                <span className="badge badge-neutral">{customer.age || 42} Years • {customer.gender || "Male"}</span>
                {customer.refillSubscriber && (
                  <span className="badge badge-green">
                    <Zap style={{ width: 11, height: 11 }} /> Auto-Refill Subscriber
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--text-muted)", marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone style={{ width: 12, height: 12, color: "var(--primary)" }} /> {customer.phone}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Mail style={{ width: 12, height: 12, color: "var(--primary)" }} /> {customer.email}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin style={{ width: 12, height: 12, color: "var(--primary)" }} /> {customer.city}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 4 }}>
                Full Address: {customer.address || "11th Cross West, Thillai Nagar, Trichy"} • Registered: {customer.registeredSince}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Total Spend</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--primary)", marginTop: 2 }}>
                {formatInr(customer.totalSpend)}
              </div>
            </div>

            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Health Wallet</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "#10b981", marginTop: 2 }}>
                {formatInr(customer.walletBalance)}
              </div>
            </div>

            <div style={{ background: "var(--bg-alt)", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Orders Count</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--text-dark)", marginTop: 2 }}>
                {customerOrders.length > 0 ? customerOrders.length : customer.totalOrders}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: "pointer",
            background: activeTab === "orders" ? "var(--primary)" : "var(--bg-alt)",
            color: activeTab === "orders" ? "#ffffff" : "var(--text-muted)",
            transition: "var(--transition)",
          }}
        >
          Complete Order History ({customerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("prescriptions")}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: "pointer",
            background: activeTab === "prescriptions" ? "var(--primary)" : "var(--bg-alt)",
            color: activeTab === "prescriptions" ? "#ffffff" : "var(--text-muted)",
            transition: "var(--transition)",
          }}
        >
          Prescription History ({customerRx.length})
        </button>

        <button
          onClick={() => setActiveTab("clinical")}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: "pointer",
            background: activeTab === "clinical" ? "var(--primary)" : "var(--bg-alt)",
            color: activeTab === "clinical" ? "#ffffff" : "var(--text-muted)",
            transition: "var(--transition)",
          }}
        >
          Clinical &amp; Health Profile
        </button>
      </div>

      {/* Tab 1: Orders History Table */}
      {activeTab === "orders" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Placed Date &amp; Time</th>
                  <th>Fulfilling Branch</th>
                  <th>Dispensed Items</th>
                  <th>Prescription Link</th>
                  <th>Payment</th>
                  <th>Total Amount</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <div className="td-mono td-primary">{ord.orderNumber}</div>
                      <div className="td-muted">{ord.deliveryType}</div>
                    </td>

                    <td className="td-muted">{ord.createdAt}</td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>
                        {ord.outletName.replace("SGN Superstore - ", "")}
                      </div>
                    </td>

                    <td className="td-muted" style={{ maxWidth: 240 }}>
                      <div className="truncate">
                        {ord.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                      </div>
                    </td>

                    <td>
                      {ord.isPrescriptionOrder ? (
                        <span className="badge badge-green">
                          <CheckCircle2 style={{ width: 10, height: 10 }} /> Rx {ord.rxRefId || "Verified"}
                        </span>
                      ) : (
                        <span className="badge badge-neutral">OTC Order</span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{ord.paymentMethod}</div>
                      <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>{ord.paymentStatus}</div>
                    </td>

                    <td>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "var(--text-dark)" }}>
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
                  </tr>
                ))}

                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                      No online orders recorded for this patient yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={orderPage}
            totalItems={customerOrders.length}
            pageSize={pageSize}
            onPageChange={setOrderPage}
          />
        </div>
      )}

      {/* Tab 2: Prescriptions History */}
      {activeTab === "prescriptions" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rx Reference</th>
                  <th>Prescribing Doctor</th>
                  <th>Clinic / Hospital</th>
                  <th>Prescribed Drugs</th>
                  <th>Status</th>
                  <th>Verified By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {customerRx.map((rx) => (
                  <tr key={rx.id}>
                    <td>
                      <div className="td-mono td-primary">{rx.refId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{rx.doctorName}</div>
                      <div className="td-muted">MCI: {rx.doctorRegistration}</div>
                    </td>
                    <td className="td-muted">{rx.clinicName}</td>
                    <td className="td-muted">
                      {rx.prescribedMeds.map((m) => `${m.name} (${m.dosage})`).join(", ")}
                    </td>
                    <td>
                      <span className={`badge ${rx.status === "CONVERTED_TO_ORDER" ? "badge-green" : rx.status === "PENDING_VERIFICATION" ? "badge-amber" : "badge-red"}`}>
                        {rx.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="td-muted">{rx.verifiedBy || "Pending Review"}</td>
                    <td className="td-muted">{rx.date}</td>
                  </tr>
                ))}

                {customerRx.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                      No prescriptions uploaded for this patient yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Clinical & Chronic Health Profile */}
      {activeTab === "clinical" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          <div className="card card-p">
            <div className="section-header">
              <div>
                <div className="section-title">Chronic Care &amp; Health Profile</div>
                <div className="section-sub">Diagnostic parameters and medication schedules</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Chronic Condition:</span>
                <strong style={{ color: "var(--primary)" }}>{customer.chronicCondition || "None Reported"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Drug Allergies:</span>
                <strong style={{ color: "#f59e0b" }}>{customer.allergies || "None Known"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Blood Group:</span>
                <strong>{customer.bloodGroup || "O+ Positive"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Auto-Refill Schedule:</span>
                <strong>{customer.refillSubscriber ? "Active (Monthly 1st week)" : "Not Subscribed"}</strong>
              </div>
            </div>
          </div>

          <div className="card card-p">
            <div className="section-header">
              <div>
                <div className="section-title">Direct Patient Communication</div>
                <div className="section-sub">SMS refill reminders &amp; digital health advisory</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "var(--bg-alt)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                <Smartphone style={{ width: 14, height: 14, color: "var(--primary)", flexShrink: 0 }} />
                <span>Mobile: <strong>{customer.phone}</strong> (WhatsApp enabled for dispatch updates)</span>
              </div>
              <div style={{ background: "var(--bg-alt)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                <Mail style={{ width: 14, height: 14, color: "var(--primary)", flexShrink: 0 }} />
                <span>Email: <strong>{customer.email}</strong> (Digital GST Invoices sent automatically)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
