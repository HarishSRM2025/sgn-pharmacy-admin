"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Building2,
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function FinancePage() {
  const { outlets, totalDailyRevenue } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const formatInr = (n: number) => "₹" + n.toLocaleString("en-IN");
  const monthlyTotal = outlets.reduce((sum, o) => sum + o.monthlyRevenue, 0);
  const gstLiabilityEstimated = Math.round(totalDailyRevenue * 0.12);

  const pageSize = 10;
  const paginated = outlets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    setConfirmModal({
      title: "GSTR-1 Tax File Exported Successfully!",
      message: "Nightly GST settlement audit report (CGST 6% + SGST 6%) across all 14 Tamil Nadu branches has been exported to GSTR1_SGN_TN_FY2026.xlsx.",
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Financial KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Today&apos;s Gross Sales (TN)</span>
          <span className="kpi-value">{formatInr(totalDailyRevenue)}</span>
          <div className="kpi-sub">
            <span className="kpi-trend-up">↑ 14.2%</span>
            <span>Across 14 superstores</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Month-to-Date Network</span>
          <span className="kpi-value">{formatInr(monthlyTotal)}</span>
          <div className="kpi-sub">
            <span>FY 2026-27 Revenue</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Estimated Daily GST (12%)</span>
          <span className="kpi-value">{formatInr(gstLiabilityEstimated)}</span>
          <div className="kpi-sub">
            <span>CGST 6% + SGST 6%</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <span className="kpi-label">Branch Audit Reconciliation</span>
          <span className="kpi-value">14 / 14</span>
          <div className="kpi-sub">
            <span className="badge badge-green">100% Settled</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="card card-sm" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "var(--text-dark)" }}>
            Branch Daily Revenue Settlements &amp; Tax Filings
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Automated nightly batch reconciliation synchronized with GST portal.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn btn-primary btn-sm"
        >
          <Download style={{ width: 14, height: 14 }} /> Export GSTR-1 Tax File
        </button>
      </div>

      {/* Settlements Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Retail Branch</th>
                <th>Store Manager</th>
                <th>Today&apos;s Gross</th>
                <th>Month-to-Date Total</th>
                <th>Estimated GST (12%)</th>
                <th style={{ textAlign: "right" }}>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div className="td-primary">{o.name.replace("SGN Superstore - ", "")}</div>
                    <div className="td-muted">{o.city}, {o.district}</div>
                  </td>

                  <td className="td-muted">{o.manager}</td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-dark)" }}>
                      {formatInr(o.dailyRevenue)}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--primary)" }}>
                      {formatInr(o.monthlyRevenue)}
                    </div>
                  </td>

                  <td className="td-muted">
                    {formatInr(Math.round(o.dailyRevenue * 0.12))}
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <span className="badge badge-green">
                      <CheckCircle2 style={{ width: 10, height: 10 }} /> Reconciled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={outlets.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
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
