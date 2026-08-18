"use client";

import React, { useState } from "react";
import {
  Tag,
  Percent,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  X,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Coupon } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function CouponsPage() {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrderValue, setMinOrderValue] = useState(499);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(200);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState(2500);
  const [applicableCategory, setApplicableCategory] = useState("All Categories");
  const [description, setDescription] = useState("");

  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  const filtered = coupons.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.applicableCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeCount = coupons.filter((c) => c.status === "ACTIVE").length;
  const totalRedemptions = coupons.reduce((s, c) => s + c.usedCount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase().replace(/\s+/g, ""),
      title,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: discountType === "PERCENTAGE" ? Number(maxDiscount || 0) : undefined,
      expiryDate,
      usageLimit: Number(usageLimit) || 1000,
      usedCount: 0,
      status: "ACTIVE",
      applicableCategory,
      description: description || `${discountType === "PERCENTAGE" ? `${discountValue}% Off` : `Flat ₹${discountValue} Off`} on orders above ₹${minOrderValue}`,
    };

    addCoupon(newCoupon);
    setShowAddModal(false);
    setCode("");
    setTitle("");
    setDescription("");

    setConfirmModal({
      title: "Coupon Code Created & Activated!",
      message: `Coupon code "${newCoupon.code}" (${newCoupon.discountType === "PERCENTAGE" ? `${newCoupon.discountValue}%` : `₹${newCoupon.discountValue}`} Off) is now live across the online storefront.`,
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Active Promo Codes</span>
          <span className="kpi-value">{activeCount} Coupons</span>
          <div className="kpi-sub">
            <span className="badge badge-green">Live on Storefront</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Total Customer Redemptions</span>
          <span className="kpi-value">{totalRedemptions.toLocaleString()}</span>
          <div className="kpi-sub">
            <span className="kpi-trend-up">↑ 22.4%</span>
            <span>Online checkout conversions</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Average Order Threshold</span>
          <span className="kpi-value">₹549</span>
          <div className="kpi-sub">
            <span>Minimum cart qualification</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <span className="kpi-label">Total Coupon Catalog</span>
          <span className="kpi-value">{coupons.length}</span>
          <div className="kpi-sub">
            <span>Campaign discounts</span>
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
            placeholder="Search coupon code, title, or category..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Coupons Only</option>
            <option value="DISABLED">Disabled Coupons</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus style={{ width: 14, height: 14 }} /> Create Promo Coupon
          </button>
        </div>
      </div>

      {/* Coupons Data Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Campaign Title</th>
                <th>Discount Benefit</th>
                <th>Min Cart Value</th>
                <th>Category Scope</th>
                <th>Redemptions / Limit</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((coup) => {
                const pct = Math.min(100, Math.round((coup.usedCount / coup.usageLimit) * 100));
                return (
                  <tr key={coup.id}>
                    <td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "var(--primary-light)",
                          border: "1px dashed var(--primary-border)",
                          borderRadius: "var(--radius-xs)",
                          padding: "4px 8px",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: "var(--primary)",
                          fontSize: 13,
                        }}
                      >
                        <Tag style={{ width: 12, height: 12 }} />
                        {coup.code}
                      </div>
                    </td>

                    <td>
                      <div className="td-primary">{coup.title}</div>
                      <div className="td-muted">{coup.description}</div>
                    </td>

                    <td>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-dark)", fontSize: 13 }}>
                        {coup.discountType === "PERCENTAGE" ? `${coup.discountValue}% OFF` : `Flat ₹${coup.discountValue} OFF`}
                      </div>
                      {coup.maxDiscount && (
                        <div className="td-muted">Max cap: ₹{coup.maxDiscount}</div>
                      )}
                    </td>

                    <td className="td-muted">
                      {formatInr(coup.minOrderValue)}
                    </td>

                    <td>
                      <span className="badge badge-neutral">{coup.applicableCategory}</span>
                    </td>

                    <td style={{ minWidth: 140 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "var(--text-dark)", marginBottom: 4 }}>
                        <span>{coup.usedCount} used</span>
                        <span style={{ color: "var(--text-light)" }}>/ {coup.usageLimit}</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 80 ? "var(--primary)" : "#10b981" }} />
                      </div>
                    </td>

                    <td className="td-muted">
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar style={{ width: 12, height: 12 }} /> {coup.expiryDate}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${coup.status === "ACTIVE" ? "badge-green" : "badge-neutral"}`}>
                        {coup.status === "ACTIVE" ? "● Active" : "Disabled"}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <button
                          onClick={() => {
                            toggleCouponStatus(coup.id);
                            setConfirmModal({
                              title: "Coupon Status Updated",
                              message: `Coupon ${coup.code} has been ${coup.status === "ACTIVE" ? "disabled" : "activated"}.`,
                              type: "success",
                            });
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          {coup.status === "ACTIVE" ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => {
                            deleteCoupon(coup.id);
                            setConfirmModal({
                              title: "Coupon Removed",
                              message: `Coupon code ${coup.code} deleted permanently.`,
                              type: "warning",
                            });
                          }}
                          className="btn btn-ghost btn-xs"
                          style={{ color: "var(--primary)" }}
                          title="Delete Coupon"
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                    No promo coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create Promo Coupon Modal */}
      {showAddModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>
                    Storefront Promotions Engine
                  </span>
                  <h3 className="modal-title">Create New Promo Coupon</h3>
                  <p className="modal-sub">Configure coupon code, discounts, cart thresholds and validity</p>
                </div>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Coupon Code (Uppercase) *</label>
                      <input
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SGNHEALTH20"
                        className="input"
                        style={{ fontFamily: "monospace", fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label className="form-label">Campaign Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. 20% Off on Health Essentials"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-3">
                    <div>
                      <label className="form-label">Discount Type *</label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        className="input"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FLAT">Flat Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        placeholder="e.g. 15 or 50"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Min Cart Value (₹) *</label>
                      <input
                        type="number"
                        required
                        value={minOrderValue}
                        onChange={(e) => setMinOrderValue(Number(e.target.value))}
                        placeholder="e.g. 499"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Max Discount Cap (₹)</label>
                      <input
                        type="number"
                        value={maxDiscount || ""}
                        onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 250 (Optional)"
                        className="input"
                        disabled={discountType === "FLAT"}
                      />
                    </div>

                    <div>
                      <label className="form-label">Usage Limit (Redemptions)</label>
                      <input
                        type="number"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(Number(e.target.value))}
                        placeholder="e.g. 5000"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Applicable Product Scope</label>
                      <select
                        value={applicableCategory}
                        onChange={(e) => setApplicableCategory(e.target.value)}
                        className="input"
                      >
                        <option value="All Categories">All Categories</option>
                        <option value="Prescription Drugs">Prescription Drugs Only</option>
                        <option value="Diabetic Care & Health Devices">Diabetic Care &amp; Health Devices</option>
                        <option value="OTC & Wellness">OTC &amp; Wellness</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Customer Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Enjoy 20% savings on your monthly medication refill order."
                      className="input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Check style={{ width: 14, height: 14 }} /> Publish Promo Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

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
