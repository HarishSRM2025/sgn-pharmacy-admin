"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Phone,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Users2,
  Package,
  Layers,
  X,
  Check,
  Building2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Outlet } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function OutletsPage() {
  const { outlets, addOutlet } = useAdmin();
  const [cityFilter, setCityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Outlet Creation
  const [name, setName] = useState("");
  const [city, setCity] = useState("Trichy");
  const [district, setDistrict] = useState("Tiruchirappalli");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [manager, setManager] = useState("");
  const [pharmacist, setPharmacist] = useState("");
  const [staffCount, setStaffCount] = useState(12);
  const [coldChainReady, setColdChainReady] = useState(true);

  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");
  const cities = ["ALL", ...Array.from(new Set(outlets.map((o) => o.city)))];

  const filtered = outlets.filter((o) => {
    if (cityFilter !== "ALL" && o.city !== cityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.manager.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRevenue = outlets.reduce((s, o) => s + o.dailyRevenue, 0);
  const totalMonthly = outlets.reduce((s, o) => s + o.monthlyRevenue, 0);
  const totalStaff = outlets.reduce((s, o) => s + o.staffCount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) return;

    const newOutlet: Outlet = {
      id: `out-${Date.now()}`,
      name: name.startsWith("SGN Superstore") ? name : `SGN Superstore - ${name}`,
      city,
      district,
      address,
      phone,
      manager: manager || "Store In-Charge (B.Pharm)",
      pharmacist: pharmacist || "Senior Dispensing Pharmacist (B.Pharm)",
      staffCount: Number(staffCount) || 10,
      dailyRevenue: 120000,
      monthlyRevenue: 3200000,
      status: "ONLINE",
      inventorySKUs: 7500,
      coldChainReady,
      latitude: 10.8281,
      longitude: 78.6869,
    };

    addOutlet(newOutlet);
    setShowAddModal(false);
    setName("");
    setAddress("");
    setPhone("");
    setManager("");
    setPharmacist("");

    setConfirmModal({
      title: "New Superstore Outlet Registered!",
      message: `${newOutlet.name} in ${newOutlet.city} has been added to the statewide network and synchronized with POS & online delivery.`,
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Network KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Registered Superstores</span>
          <span className="kpi-value">{outlets.length} Outlets</span>
          <div className="kpi-sub">
            <span className="badge badge-green">100% Online</span>
            <span>Tamil Nadu Network</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Today&apos;s Store Sales</span>
          <span className="kpi-value">{formatInr(totalRevenue)}</span>
          <div className="kpi-sub">
            <span className="kpi-trend-up">↑ 12.8%</span>
            <span>Across all active branches</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Monthly Gross Network</span>
          <span className="kpi-value">{formatInr(totalMonthly)}</span>
          <div className="kpi-sub">
            <span>FY 2026-27 Revenue</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <span className="kpi-label">Total Staff &amp; Pharmacists</span>
          <span className="kpi-value">{totalStaff}</span>
          <div className="kpi-sub">
            <span>Across statewide branches</span>
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search outlet branch, address, manager..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* City Filter Pills */}
          <div style={{ display: "flex", gap: 4, background: "var(--bg-alt)", padding: 4, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            {cities.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCityFilter(c);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: "var(--radius-xs)",
                  border: "none",
                  cursor: "pointer",
                  background: cityFilter === c ? "var(--primary)" : "transparent",
                  color: cityFilter === c ? "#ffffff" : "var(--text-muted)",
                  transition: "var(--transition)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus style={{ width: 14, height: 14 }} /> Register New Superstore Outlet
          </button>
        </div>
      </div>

      {/* Outlets Table View Only */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Superstore Branch</th>
                <th>City / District</th>
                <th>Manager &amp; Pharmacist</th>
                <th>Phone Contact</th>
                <th>Today&apos;s Gross</th>
                <th>Monthly Sales</th>
                <th>Inventory SKUs</th>
                <th>POS Terminal</th>
                <th style={{ textAlign: "right" }}>Branch Analytics</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((outlet) => (
                <tr key={outlet.id}>
                  <td>
                    <Link
                      href={`/outlets/${outlet.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="td-primary" style={{ cursor: "pointer" }}>
                        {outlet.name.replace("SGN Superstore - ", "")}
                      </div>
                      <div className="td-muted">{outlet.address.slice(0, 45)}...</div>
                    </Link>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{outlet.city}</div>
                    <div className="td-muted">{outlet.district}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{outlet.manager}</div>
                    <div className="td-muted">Rx: {outlet.pharmacist}</div>
                  </td>

                  <td>
                    <a
                      href={`tel:${outlet.phone.replace(/\s+/g, "")}`}
                      style={{ textDecoration: "none", color: "var(--text-main)", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Phone style={{ width: 12, height: 12, color: "var(--primary)" }} /> {outlet.phone}
                    </a>
                  </td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-dark)" }}>
                      {formatInr(outlet.dailyRevenue)}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--primary)" }}>
                      {formatInr(outlet.monthlyRevenue)}
                    </div>
                  </td>

                  <td>
                    <div className="td-mono">{outlet.inventorySKUs.toLocaleString()}</div>
                  </td>

                  <td>
                    <span className="badge badge-green">
                      <span className="dot dot-green" /> Online
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <Link href={`/outlets/${outlet.id}`} className="btn btn-ghost btn-xs">
                      View Analytics &amp; Orders <ArrowRight style={{ width: 12, height: 12 }} />
                    </Link>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                    No superstore outlets found.
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

      {/* Global Full-App Viewport Add Outlet Modal */}
      {showAddModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>
                    Tamil Nadu Superstore Network
                  </span>
                  <h3 className="modal-title">Register New Superstore Outlet</h3>
                  <p className="modal-sub">Onboard a retail branch into SGN enterprise inventory and delivery routing</p>
                </div>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="form-label">Superstore Outlet Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. SGN Superstore - Gandhipuram"
                      className="input"
                    />
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Coimbatore / Trichy / Madurai"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">District *</label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Coimbatore District"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Full Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. No. 45, Cross Cut Road, Gandhipuram, Coimbatore 641012"
                      className="input"
                    />
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Phone Contact *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 422 254 0000"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Total Staff Count</label>
                      <input
                        type="number"
                        value={staffCount}
                        onChange={(e) => setStaffCount(Number(e.target.value))}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Store Manager Name</label>
                      <input
                        type="text"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        placeholder="e.g. R. Karthik (M.Pharm)"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Chief Pharmacist Name</label>
                      <input
                        type="text"
                        value={pharmacist}
                        onChange={(e) => setPharmacist(e.target.value)}
                        placeholder="e.g. S. Deepa (B.Pharm)"
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
                    <input
                      type="checkbox"
                      id="coldchain"
                      checked={coldChainReady}
                      onChange={(e) => setColdChainReady(e.target.checked)}
                      style={{ accentColor: "var(--primary)", width: 16, height: 16 }}
                    />
                    <label htmlFor="coldchain" style={{ fontSize: 13, color: "var(--text-dark)", cursor: "pointer", fontWeight: 600 }}>
                      Cold Chain Storage Ready (2°C to 8°C Insulin &amp; Biologics Refrigerator)
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Check style={{ width: 14, height: 14 }} /> Register Superstore Outlet
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
