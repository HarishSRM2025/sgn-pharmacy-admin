"use client";

import React, { useState } from "react";
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Thermometer,
  ChevronDown,
  X,
  Check,
  Package,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { MedicineItem } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";

const CATEGORIES = ["ALL", "Prescription Drugs", "OTC", "Diabetic Care", "Health Devices"];
const SCHEDULES = ["ALL", "OTC", "SCHEDULE_H", "SCHEDULE_H1"];

export default function InventoryPage() {
  const { medicines, adjustStock, addMedicine, lowStockCount } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [scheduleFilter, setScheduleFilter] = useState("ALL");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustModal, setAdjustModal] = useState<{ med: MedicineItem; type: "add" | "remove" } | null>(null);
  const [adjustQty, setAdjustQty] = useState(50);

  // Form State
  const [form, setForm] = useState({
    name: "",
    salt: "",
    brand: "",
    category: "Prescription Drugs" as MedicineItem["category"],
    schedule: "SCHEDULE_H" as MedicineItem["schedule"],
    coldChain: false,
    batchNumber: "",
    mfgDate: "2026-03-01",
    expiryDate: "2028-02-28",
    mrp: 120,
    costPrice: 75,
    stockTotal: 500,
  });

  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");

  const filtered = medicines.filter((m) => {
    if (categoryFilter !== "ALL" && m.category !== categoryFilter) return false;
    if (scheduleFilter !== "ALL" && m.schedule !== scheduleFilter) return false;
    if (onlyLowStock && m.status !== "LOW_STOCK" && m.status !== "OUT_OF_STOCK") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.salt.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalStockUnits = medicines.reduce((s, m) => s + m.stockTotal, 0);
  const coldChainCount = medicines.filter((m) => m.coldChain).length;
  const marginPreview = form.mrp > 0 ? Math.round(((form.mrp - form.costPrice) / form.mrp) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand) return;

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      sku: `SGN-${Math.floor(10000 + Math.random() * 90000)}`,
      name: form.name,
      salt: form.salt,
      brand: form.brand,
      category: form.category,
      schedule: form.schedule,
      coldChain: form.coldChain,
      batchNumber: form.batchNumber || `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      mfgDate: form.mfgDate,
      expiryDate: form.expiryDate,
      mrp: Number(form.mrp),
      costPrice: Number(form.costPrice),
      stockTotal: Number(form.stockTotal),
      reorderLevel: 100,
      stockByOutlet: { "out-01": Math.round(Number(form.stockTotal) / 2) },
      status: Number(form.stockTotal) <= 100 ? "LOW_STOCK" : "IN_STOCK",
    };

    addMedicine(newMed);
    setShowAddModal(false);
    setForm({
      name: "",
      salt: "",
      brand: "",
      category: "Prescription Drugs",
      schedule: "SCHEDULE_H",
      coldChain: false,
      batchNumber: "",
      mfgDate: "2026-03-01",
      expiryDate: "2028-02-28",
      mrp: 120,
      costPrice: 75,
      stockTotal: 500,
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Inventory KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Master Medicine SKUs</span>
          <span className="kpi-value">{medicines.length.toLocaleString()}</span>
          <div className="kpi-sub">
            <span>Verified CDSCO clinical catalog</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Total Warehouse Units</span>
          <span className="kpi-value">{(totalStockUnits / 1000).toFixed(1)}k</span>
          <div className="kpi-sub">
            <span className="badge badge-green">In-Stock</span>
            <span>Across 14 outlets</span>
          </div>
        </div>

        <div className="kpi-card accent-amber">
          <span className="kpi-label">Low Stock Alerts</span>
          <span className="kpi-value">{lowStockCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-amber">Reorder Required</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Cold-Chain Inventory</span>
          <span className="kpi-value">{coldChainCount}</span>
          <div className="kpi-sub">
            <span className="badge badge-blue">2-8°C Monitored</span>
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search medicine brand, generic salt, or SKU..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input"
            style={{ width: "auto", height: 36, padding: "0 12px", cursor: "pointer" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={scheduleFilter}
            onChange={(e) => {
              setScheduleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input"
            style={{ width: "auto", height: 36, padding: "0 12px", cursor: "pointer" }}
          >
            {SCHEDULES.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Schedules" : s.replace("_", " ")}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setOnlyLowStock(!onlyLowStock);
              setCurrentPage(1);
            }}
            className={`btn btn-sm ${onlyLowStock ? "btn-primary" : "btn-ghost"}`}
          >
            <AlertTriangle style={{ width: 13, height: 13 }} />
            Low Stock ({lowStockCount})
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus style={{ width: 14, height: 14 }} />
            Add Medicine SKU
          </button>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicine Identity</th>
                <th>Manufacturer / Category</th>
                <th>CDSCO Schedule</th>
                <th>Batch &amp; Expiry</th>
                <th>Pricing &amp; Margins</th>
                <th>Stock Level</th>
                <th style={{ textAlign: "right" }}>Quick Adjust</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((med) => {
                const margin = Math.round(((med.mrp - med.costPrice) / med.mrp) * 100);
                const isLow = med.stockTotal <= med.reorderLevel;

                return (
                  <tr key={med.id}>
                    <td>
                      <div className="td-primary" style={{ fontSize: 13 }}>{med.name}</div>
                      <div className="td-muted">{med.salt}</div>
                      <span className="td-mono td-muted" style={{ fontSize: 10, display: "block", marginTop: 2 }}>
                        {med.sku}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{med.brand}</div>
                      <div className="td-muted">{med.category}</div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                        <span
                          className={`badge ${
                            med.schedule === "SCHEDULE_H1"
                              ? "badge-red"
                              : med.schedule === "SCHEDULE_H"
                              ? "badge-amber"
                              : "badge-neutral"
                          }`}
                        >
                          {med.schedule.replace("_", " ")}
                        </span>
                        {med.coldChain && (
                          <span className="badge badge-blue">
                            <Thermometer style={{ width: 10, height: 10 }} /> 2-8°C Cold Chain
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="td-mono td-primary">{med.batchNumber}</div>
                      <div className="td-muted">Exp: {med.expiryDate}</div>
                    </td>

                    <td>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-dark)" }}>
                        {formatInr(med.mrp)}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>
                        Cost: {formatInr(med.costPrice)} ({margin}% margin)
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 14,
                            fontWeight: 700,
                            color: isLow ? "var(--primary)" : "var(--text-dark)",
                          }}
                        >
                          {med.stockTotal.toLocaleString()}
                        </span>
                        {isLow && <span className="badge badge-red">LOW</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-light)" }}>Reorder @ {med.reorderLevel}</div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <button
                          onClick={() => {
                            setAdjustModal({ med, type: "remove" });
                            setAdjustQty(50);
                          }}
                          className="btn btn-ghost btn-xs"
                          title="Dispense stock"
                        >
                          -50
                        </button>
                        <button
                          onClick={() => {
                            setAdjustModal({ med, type: "add" });
                            setAdjustQty(100);
                          }}
                          className="btn btn-dark btn-xs"
                          title="Restock units"
                        >
                          +100
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Max 10 rows per page pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Global Full-App Viewport Stock Adjustment Modal */}
      {adjustModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setAdjustModal(null)}>
            <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">
                    {adjustModal.type === "add" ? "Restock Inventory" : "Dispense Inventory"}
                  </h3>
                  <p className="modal-sub">{adjustModal.med.name} ({adjustModal.med.sku})</p>
                </div>
                <button className="modal-close" onClick={() => setAdjustModal(null)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="form-label">
                    Quantity to {adjustModal.type === "add" ? "Add to Stock" : "Dispense / Deduct"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="input"
                    style={{ fontSize: 15, fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: "var(--bg-alt)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-muted)" }}>
                  Current stock: <strong>{adjustModal.med.stockTotal} units</strong> → New balance:{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    {adjustModal.type === "add"
                      ? adjustModal.med.stockTotal + adjustQty
                      : Math.max(0, adjustModal.med.stockTotal - adjustQty)}{" "}
                    units
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setAdjustModal(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    adjustStock(
                      adjustModal.med.id,
                      "out-01",
                      adjustModal.type === "add" ? adjustQty : -adjustQty
                    );
                    setAdjustModal(null);
                  }}
                >
                  <Check style={{ width: 14, height: 14 }} /> Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Global Full-App Viewport Add Medicine Modal */}
      {showAddModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" style={{ maxWidth: 680, maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-red" style={{ marginBottom: 4 }}>
                    <Sparkles style={{ width: 10, height: 10 }} /> Clinical Catalog
                  </span>
                  <h3 className="modal-title">Register New Medicine SKU</h3>
                  <p className="modal-sub">Add a verified pharmaceutical formulation to statewide inventory</p>
                </div>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} style={{ overflowY: "auto", flex: 1 }}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* 1. Drug Identification */}
                  <div className="form-section">
                    <div className="form-section-title">1. Drug Identification &amp; Salt Composition</div>
                    <div className="form-grid form-grid-2">
                      <div>
                        <label className="form-label">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setF("name", e.target.value)}
                          placeholder="e.g. Paracetamol 650mg Tablets"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Generic Salt Composition *</label>
                        <input
                          type="text"
                          required
                          value={form.salt}
                          onChange={(e) => setF("salt", e.target.value)}
                          placeholder="e.g. Paracetamol IP 650mg"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Manufacturer / Pharma Company *</label>
                        <input
                          type="text"
                          required
                          value={form.brand}
                          onChange={(e) => setF("brand", e.target.value)}
                          placeholder="e.g. Cipla Ltd / Sun Pharma"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Therapeutic Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setF("category", e.target.value)}
                          className="input"
                        >
                          <option value="Prescription Drugs">Prescription Drugs</option>
                          <option value="OTC">OTC Formulations</option>
                          <option value="Diabetic Care">Diabetic Care</option>
                          <option value="Health Devices">Health Devices</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Regulatory & Cold-Chain */}
                  <div className="form-section">
                    <div className="form-section-title">2. CDSCO Schedule &amp; Storage Conditions</div>
                    <div className="form-grid form-grid-2">
                      <div>
                        <label className="form-label">CDSCO Drug Schedule</label>
                        <select
                          value={form.schedule}
                          onChange={(e) => setF("schedule", e.target.value)}
                          className="input"
                        >
                          <option value="OTC">OTC (Non-Prescription)</option>
                          <option value="SCHEDULE_H">Schedule H (Prescription)</option>
                          <option value="SCHEDULE_H1">Schedule H1 (Strictly Controlled)</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", paddingTop: 18 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={form.coldChain}
                            onChange={(e) => setF("coldChain", e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>
                            Requires 2-8°C Cold-Chain Refrigeration
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 3. Batch & Expiry */}
                  <div className="form-section">
                    <div className="form-section-title">3. Batch Details &amp; Expiry Tracker</div>
                    <div className="form-grid form-grid-3">
                      <div>
                        <label className="form-label">Batch Number</label>
                        <input
                          type="text"
                          value={form.batchNumber}
                          onChange={(e) => setF("batchNumber", e.target.value)}
                          placeholder="e.g. BAT-9021"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Mfg Date</label>
                        <input
                          type="date"
                          value={form.mfgDate}
                          onChange={(e) => setF("mfgDate", e.target.value)}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="date"
                          value={form.expiryDate}
                          onChange={(e) => setF("expiryDate", e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Pricing & Initial Units */}
                  <div className="form-section">
                    <div className="form-section-title">4. Pricing &amp; Warehouse Opening Stock</div>
                    <div className="form-grid form-grid-3">
                      <div>
                        <label className="form-label">Retail MRP (₹)</label>
                        <input
                          type="number"
                          min={1}
                          value={form.mrp}
                          onChange={(e) => setF("mrp", Number(e.target.value))}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Cost Price (₹)</label>
                        <input
                          type="number"
                          min={1}
                          value={form.costPrice}
                          onChange={(e) => setF("costPrice", Number(e.target.value))}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Initial Stock (Units)</label>
                        <input
                          type="number"
                          min={1}
                          value={form.stockTotal}
                          onChange={(e) => setF("stockTotal", Number(e.target.value))}
                          className="input"
                        />
                      </div>
                    </div>

                    {form.mrp > 0 && form.costPrice > 0 && (
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg-alt)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-main)", display: "flex", justifyContent: "space-between" }}>
                        <span>Profit Margin: <strong style={{ color: "var(--primary)" }}>{marginPreview}%</strong></span>
                        <span>Gross Profit per Unit: <strong style={{ color: "#10b981" }}>₹{form.mrp - form.costPrice}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Check style={{ width: 14, height: 14 }} /> Save &amp; Add SKU
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
