"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Check,
  ShieldCheck,
  Building2,
  Phone,
  User,
  Store,
  Truck,
  Image as ImageIcon,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { PrescriptionVerification } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Link from "next/link";

export default function PrescriptionsPage() {
  const {
    prescriptions,
    outlets,
    convertPrescriptionToOrder,
    rejectPrescription,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [outletFilter, setOutletFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRx, setSelectedRx] = useState<PrescriptionVerification | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"EXPRESS_2HR" | "STANDARD_SAME_DAY" | "STORE_PICKUP">("EXPRESS_2HR");
  const [pharmacistNotes, setPharmacistNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  // Success Confirmation Modal State
  const [successModal, setSuccessModal] = useState<{ title: string; message: string; orderNumber?: string } | null>(null);

  const filtered = prescriptions.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (outletFilter !== "ALL" && p.allocatedOutlet !== outletFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.refId.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.patientPhone.includes(q) ||
        p.doctorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingCount = prescriptions.filter((p) => p.status === "PENDING_VERIFICATION").length;
  const convertedCount = prescriptions.filter((p) => p.status === "CONVERTED_TO_ORDER").length;
  const rejectedCount = prescriptions.filter((p) => p.status === "REJECTED").length;

  const handleConvert = () => {
    if (!selectedRx) return;
    const order = convertPrescriptionToOrder(selectedRx.id, deliveryType, pharmacistNotes);
    const orderNumber = order ? order.orderNumber : "New Order";
    setSelectedRx(null);
    setPharmacistNotes("");
    setSuccessModal({
      title: "Prescription Approved & Converted to Live Order!",
      message: `Prescription ${selectedRx.refId} for ${selectedRx.patientName} has been verified and converted to Order #${orderNumber}. It is now visible on the Orders & Delivery page for dispatch.`,
      orderNumber,
    });
  };

  const handleReject = () => {
    if (!selectedRx || !rejectReason) return;
    rejectPrescription(selectedRx.id, rejectReason);
    setSelectedRx(null);
    setShowRejectBox(false);
    setRejectReason("");
    setSuccessModal({
      title: "Prescription Rejected",
      message: `Prescription ${selectedRx.refId} has been marked as Rejected. Reason recorded: "${rejectReason}".`,
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-amber">
          <span className="kpi-label">Pending Verification</span>
          <span className="kpi-value">{pendingCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-amber">Awaiting Review</span>
            <span>Needs Pharmacist Approval</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Converted to Live Orders</span>
          <span className="kpi-value">{convertedCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-green">Dispatched to Orders</span>
          </div>
        </div>

        <div className="kpi-card accent-red">
          <span className="kpi-label">Rejected Prescriptions</span>
          <span className="kpi-value">{rejectedCount}</span>
          <div className="kpi-sub">
            <span>Invalid / Expired Slips</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Total Uploaded Slips</span>
          <span className="kpi-value">{prescriptions.length}</span>
          <div className="kpi-sub">
            <span>CDSCO Verified Workflow</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
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
            placeholder="Search Rx Ref, patient name, doctor, or mobile..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Branch Filter */}
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
                  {o.name.replace("SGN Superstore - ", "")}
                </option>
              ))}
            </select>
          </div>

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
            <option value="ALL">All Verification Statuses</option>
            <option value="PENDING_VERIFICATION">Pending Verification Only</option>
            <option value="CONVERTED_TO_ORDER">Converted to Order</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Prescriptions Data Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rx Reference</th>
                <th>Patient Details</th>
                <th>Prescribing Physician</th>
                <th>Rx Photo Preview</th>
                <th>Prescribed Items</th>
                <th>Assigned Outlet</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((rx) => {
                const assignedStore = outlets.find((o) => o.id === rx.allocatedOutlet);
                return (
                  <tr key={rx.id}>
                    <td>
                      <div className="td-mono td-primary">{rx.refId}</div>
                      <div className="td-muted">{rx.createdAt}</div>
                    </td>

                    <td>
                      <Link
                        href={`/customers/${rx.patientId}`}
                        style={{ textDecoration: "none" }}
                        className="td-primary"
                      >
                        {rx.patientName}
                      </Link>
                      <div className="td-muted">{rx.patientPhone} • {rx.patientAge}y ({rx.patientGender})</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{rx.doctorName}</div>
                      <div className="td-muted">
                        Reg: <strong style={{ color: "var(--primary)" }}>{rx.doctorRegistration}</strong> • {rx.clinicName}
                      </div>
                    </td>

                    <td>
                      <button
                        onClick={() => setShowPhotoModal(rx.prescriptionImage)}
                        className="btn btn-ghost btn-xs"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                        title="Click to zoom doctor's Rx slip"
                      >
                        <ImageIcon style={{ width: 13, height: 13, color: "var(--primary)" }} /> View Rx Photo
                      </button>
                    </td>

                    <td className="td-muted" style={{ maxWidth: 220 }}>
                      <div className="truncate">
                        {rx.prescribedMeds.map((m) => `${m.name} (${m.dosage})`).join(", ")}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>
                        {assignedStore ? assignedStore.name.replace("SGN Superstore - ", "") : "Main Outlet"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          rx.status === "CONVERTED_TO_ORDER"
                            ? "badge-green"
                            : rx.status === "PENDING_VERIFICATION"
                            ? "badge-amber"
                            : "badge-red"
                        }`}
                      >
                        {rx.status === "CONVERTED_TO_ORDER"
                          ? "Converted to Order"
                          : rx.status === "PENDING_VERIFICATION"
                          ? "Pending Verification"
                          : "Rejected"}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {rx.status === "PENDING_VERIFICATION" ? (
                        <button
                          onClick={() => {
                            setSelectedRx(rx);
                            setShowRejectBox(false);
                          }}
                          className="btn btn-primary btn-xs"
                        >
                          <FileCheck2 style={{ width: 13, height: 13 }} /> Review &amp; Convert
                        </button>
                      ) : rx.status === "CONVERTED_TO_ORDER" ? (
                        <Link href="/orders" className="btn btn-ghost btn-xs">
                          View in Orders <ArrowRight style={{ width: 11, height: 11 }} />
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRx(rx);
                            setShowRejectBox(false);
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          View Details
                        </button>
                      )}
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

      {/* Global Full-Screen Prescription Review & Order Conversion Modal */}
      {selectedRx && (
        <ModalPortal>
          <div className="overlay" onClick={() => setSelectedRx(null)}>
            <div className="modal" style={{ maxWidth: 860, maxHeight: "92vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: 4 }}>
                    <ShieldCheck style={{ width: 10, height: 10 }} /> CDSCO Clinical Protocol
                  </span>
                  <h3 className="modal-title">Pharmacist Prescription Verification &amp; Order Conversion</h3>
                  <p className="modal-sub">
                    Reference: {selectedRx.refId} • Patient: {selectedRx.patientName} ({selectedRx.patientAge}y, {selectedRx.patientGender})
                  </p>
                </div>
                <button className="modal-close" onClick={() => setSelectedRx(null)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 18, overflowY: "auto", flex: 1 }}>
                {/* 2-Column Split: Left = Prescription Photo & Details, Right = Medicine Items & Conversion */}
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
                  {/* Left Column: Doctor & Prescription Photo */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Doctor Info */}
                    <div style={{ background: "var(--bg-alt)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: 13 }}>{selectedRx.doctorName}</div>
                      <div style={{ color: "var(--primary)", fontWeight: 700, marginTop: 2 }}>
                        MCI Reg: {selectedRx.doctorRegistration}
                      </div>
                      <div style={{ color: "var(--text-muted)", marginTop: 2 }}>{selectedRx.clinicName}</div>
                      <div style={{ color: "var(--text-light)", marginTop: 2 }}>Date: {selectedRx.date}</div>
                    </div>

                    {/* Prescription Slip Photo Rendering */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)", marginBottom: 6 }}>
                        Uploaded Doctor Prescription Slip Photo
                      </div>
                      <div
                        onClick={() => setShowPhotoModal(selectedRx.prescriptionImage)}
                        style={{
                          border: "2px dashed var(--border)",
                          borderRadius: "var(--radius-sm)",
                          padding: 12,
                          background: "#fdfdfd",
                          cursor: "pointer",
                          textAlign: "center",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Realistic Mock Prescription Document */}
                        <div style={{ background: "#ffffff", padding: "16px 14px", borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", textAlign: "left", fontFamily: "serif" }}>
                          <div style={{ borderBottom: "2px solid var(--primary)", paddingBottom: 6, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <strong style={{ fontSize: 14, color: "var(--primary)", display: "block" }}>{selectedRx.clinicName}</strong>
                              <span style={{ fontSize: 11, color: "#666" }}>{selectedRx.doctorName} • Reg: {selectedRx.doctorRegistration}</span>
                            </div>
                            <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>Rx</span>
                          </div>

                          <div style={{ fontSize: 11, color: "#444", marginBottom: 10, borderBottom: "1px dashed #ccc", paddingBottom: 4 }}>
                            <strong>Patient:</strong> {selectedRx.patientName}, {selectedRx.patientAge}y/{selectedRx.patientGender[0]} • <strong>Date:</strong> {selectedRx.date}
                          </div>

                          <div style={{ fontSize: 12, color: "#111", lineHeight: 1.6, minHeight: 90 }}>
                            {selectedRx.prescribedMeds.map((m, idx) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                <strong>{idx + 1}. {m.name}</strong> — {m.dosage} [{m.frequency} x {m.duration}]
                              </div>
                            ))}
                          </div>

                          <div style={{ borderTop: "1px solid #eee", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 9, color: "#888", textTransform: "uppercase" }}>Digitally Verified Clinical Document</span>
                            <span style={{ fontSize: 11, fontStyle: "italic", color: "var(--primary)" }}>Dr. Signature Verified</span>
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <Eye style={{ width: 13, height: 13 }} /> Click to View High-Resolution Fullscreen
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Medicine Allocation & Live Order Conversion */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Prescribed Items Check */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)", marginBottom: 6 }}>
                        Prescription Items &amp; Stock Availability
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {selectedRx.prescribedMeds.map((med, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: "8px 12px",
                              background: "var(--bg-alt)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: 12,
                            }}
                          >
                            <div>
                              <strong style={{ color: "var(--text-dark)", display: "block" }}>{med.name}</strong>
                              <span style={{ color: "var(--text-muted)" }}>
                                {med.dosage} • {med.frequency} • Qty: {med.qty}
                              </span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className="badge badge-green">In Stock</span>
                              <div style={{ fontWeight: 700, color: "var(--text-dark)", marginTop: 2 }}>
                                ₹{med.price * med.qty}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfilling Outlet & Delivery Mode */}
                    <div className="form-grid form-grid-2">
                      <div>
                        <label className="form-label">Fulfilling Superstore</label>
                        <div style={{ background: "var(--bg-alt)", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 700 }}>
                          {outlets.find((o) => o.id === selectedRx.allocatedOutlet)?.name.replace("SGN Superstore - ", "") || "Anna Nagar, Chennai"}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Delivery Mode</label>
                        <select
                          value={deliveryType}
                          onChange={(e) => setDeliveryType(e.target.value as any)}
                          className="input"
                          style={{ fontSize: 12, padding: "7px 10px" }}
                        >
                          <option value="EXPRESS_2HR">2-Hour Express Delivery</option>
                          <option value="STANDARD_SAME_DAY">Standard Same-Day</option>
                          <option value="STORE_PICKUP">Store Walk-in Pickup</option>
                        </select>
                      </div>
                    </div>

                    {/* Pharmacist Notes */}
                    <div>
                      <label className="form-label">Pharmacist Verification Note</label>
                      <input
                        type="text"
                        value={pharmacistNotes}
                        onChange={(e) => setPharmacistNotes(e.target.value)}
                        placeholder="e.g. Verified with Dr. MCI registration, medicines checked in batch"
                        className="input"
                        style={{ fontSize: 12 }}
                      />
                    </div>

                    {/* Rejection input box */}
                    {showRejectBox && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "var(--primary-light)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-border)" }}>
                        <label className="form-label" style={{ color: "var(--primary)" }}>Reason for Prescription Rejection *</label>
                        <textarea
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Specify rejection reason (e.g. illegible doctor stamp, expired slip, unauthorized dosage)..."
                          className="input"
                          style={{ fontSize: 12 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRx(null)}>
                  Cancel
                </button>

                {selectedRx.status === "PENDING_VERIFICATION" && (
                  <>
                    {showRejectBox ? (
                      <button className="btn btn-primary btn-sm" onClick={handleReject}>
                        Confirm Rejection
                      </button>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--primary)", borderColor: "var(--primary-border)" }}
                        onClick={() => setShowRejectBox(true)}
                      >
                        <XCircle style={{ width: 14, height: 14 }} /> Reject Prescription
                      </button>
                    )}

                    {!showRejectBox && (
                      <button className="btn btn-primary btn-sm" onClick={handleConvert}>
                        <Check style={{ width: 14, height: 14 }} /> Approve &amp; Convert to Live Order
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Prescription Fullscreen Photo Zoom Modal */}
      {showPhotoModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowPhotoModal(null)}>
            <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Doctor Prescription Original Slip</h3>
                <button className="modal-close" onClick={() => setShowPhotoModal(null)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: "center", padding: 16 }}>
                <img
                  src={showPhotoModal}
                  alt="Doctor Prescription Slip"
                  style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary btn-sm" onClick={() => setShowPhotoModal(null)}>
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Action Success Confirmation Modal */}
      <ConfirmModal
        isOpen={!!successModal}
        onClose={() => setSuccessModal(null)}
        title={successModal?.title || "Success"}
        message={successModal?.message || ""}
        type="success"
        confirmText="OK, View Queue"
      />
    </div>
  );
}
