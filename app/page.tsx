"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Package, FileCheck2, Store, Truck, Users2,
  ArrowUpRight, ArrowRight, Activity, Clock, CheckCircle2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

/* ---- tiny inline bar chart ---- */
function SparkBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.round((v / max) * 100)}%`,
            background: color,
            borderRadius: 3,
            opacity: i === values.length - 1 ? 1 : 0.4 + (i / values.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ---- monthly revenue chart ---- */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHART_DELIVERY = [42,50,45,58,52,65,74,68,62,70,60,72];
const CHART_POS      = [35,40,48,52,49,55,60,58,50,54,48,56];

function RevenueChart() {
  const [hover, setHover] = useState<number | null>(6);
  const max = Math.max(...CHART_DELIVERY.map((d, i) => d + CHART_POS[i]));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, position: "relative" }}>
      {MONTHS.map((m, i) => {
        const total = CHART_DELIVERY[i] + CHART_POS[i];
        const delivH = Math.round((CHART_DELIVERY[i] / max) * 100);
        const posH   = Math.round((CHART_POS[i]      / max) * 100);
        const isHov  = hover === i;
        return (
          <div
            key={m}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
            onMouseEnter={() => setHover(i)}
          >
            {isHov && (
              <div style={{
                position: "absolute", top: 0, background: "#fff", border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 12px", fontSize: 11, fontWeight: 700, boxShadow: "var(--shadow-md)",
                whiteSpace: "nowrap", zIndex: 10, color: "var(--text-dark)",
                transform: `translateX(${i > 9 ? "-60px" : i > 5 ? "-30px" : "0"})`,
              }}>
                <div style={{ color: "var(--text-light)", marginBottom: 4 }}>{m} 2026</div>
                <div style={{ color: "#3b82f6" }}>Delivery: ₹{CHART_DELIVERY[i]}L</div>
                <div style={{ color: "#ec4899" }}>POS: ₹{CHART_POS[i]}L</div>
              </div>
            )}
            <div style={{
              width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end",
              height: 140, borderRadius: 4, overflow: "hidden",
              opacity: isHov ? 1 : 0.65, transition: "opacity .2s",
            }}>
              <div style={{ height: `${posH}%`,   background: "#f472b6", transition: "height .4s" }} />
              <div style={{ height: `${delivH}%`, background: "#6366f1", transition: "height .4s" }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: isHov ? 800 : 600, color: isHov ? "var(--text-dark)" : "var(--text-light)" }}>
              {m}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const {
    outlets, orders, totalDailyRevenue,
    pendingRxCount, activeOrdersCount, lowStockCount,
  } = useAdmin();

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const topOutlets = [...outlets].sort((a, b) => b.dailyRevenue - a.dailyRevenue).slice(0, 5);
  const recentOrders = orders.slice(0, 6);

  const kpis = [
    {
      label: "Today's Revenue",
      value: fmt(totalDailyRevenue),
      sub: "+14.2% vs last month",
      icon: TrendingUp,
      accent: "accent-red",
      iconBg: "#fff1f1",
      iconColor: "var(--primary)",
      spark: [62,70,68,75,72,80,74,82,79,85,88,92],
    },
    {
      label: "Active Deliveries",
      value: String(activeOrdersCount),
      sub: "Fleet on GPS tracking",
      icon: Truck,
      accent: "accent-blue",
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      spark: [12,18,14,22,19,25,21,28,24,30,27,32],
    },
    {
      label: "Rx Queue",
      value: String(pendingRxCount),
      sub: "Awaiting pharmacist review",
      icon: FileCheck2,
      accent: "accent-amber",
      iconBg: "#fffbeb",
      iconColor: "#f59e0b",
      spark: [3,5,2,6,4,7,3,8,5,9,6,3],
    },
    {
      label: "Superstores Open",
      value: `${outlets.length} / ${outlets.length}`,
      sub: "100% operational today",
      icon: Store,
      accent: "accent-green",
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      spark: [14,14,14,14,14,14,14,14,14,14,14,14],
    },
  ];

  return (
    <div className="anim-fade-up">
      {/* ══════════════════════════════════
          KPI ROW
      ══════════════════════════════════ */}
      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`kpi-card anim-fade-up ${k.accent}`}>
              <div className="kpi-icon" style={{ background: k.iconBg }}>
                <Icon style={{ width: 20, height: 20, color: k.iconColor }} />
              </div>
              <span className="kpi-label">{k.label}</span>
              <span className="kpi-value">{k.value}</span>
              <div className="kpi-sub">
                <ArrowUpRight style={{ width: 13, height: 13, color: "#10b981" }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{k.sub}</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <SparkBar values={k.spark} color={k.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════
          MAIN GRID: Chart + Outlets
      ══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>
        {/* Revenue Chart Card */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">Network Revenue Analytics</div>
              <div className="section-sub">Monthly online delivery vs. store walk-in sales — FY 2026-27</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#6366f1", display: "inline-block" }} />
                Home Delivery
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#f472b6", display: "inline-block" }} />
                Store POS
              </div>
            </div>
          </div>

          {/* Big revenue figure */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: 34,
              fontWeight: 700,
              color: "var(--text-dark)",
              letterSpacing: "-.03em",
            }}>
              ₹1,04,62,700
            </span>
            <span className="badge badge-green" style={{ fontSize: 12 }}>
              ↑ 8.5% MoM
            </span>
          </div>

          <RevenueChart />
        </div>

        {/* Top Outlets */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">Top Performing Outlets</div>
              <div className="section-sub">Ranked by today's gross sales</div>
            </div>
            <Link href="/outlets" className="section-link">View all</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topOutlets.map((o, idx) => {
              const pct = Math.round((o.dailyRevenue / topOutlets[0].dailyRevenue) * 100);
              const colors = ["var(--primary)","#6366f1","#10b981","#f59e0b","#8b5cf6"];
              return (
                <div key={o.id}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 4,
                        background: idx === 0 ? "var(--primary)" : "var(--bg-alt)",
                        color: idx === 0 ? "#fff" : "var(--text-muted)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11, flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text-dark)" }}>
                          {o.name.replace("SGN Superstore - ","")}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-light)" }}>{o.city}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-dark)" }}>
                      {"₹"+o.dailyRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: colors[idx] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          BOTTOM GRID: Orders + Status
      ══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Recent Orders Table */}
        <div className="card">
          <div className="card-p" style={{ paddingBottom: 0 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Recent Orders</div>
                <div className="section-sub">Latest multi-channel order activity</div>
              </div>
              <Link href="/orders" className="section-link" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                View all <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Channel</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="td-mono td-primary">{o.orderNumber}</td>
                    <td>
                      <div className="td-primary" style={{ fontSize: 13 }}>{o.customerName}</div>
                      <div className="td-muted">{o.customerPhone}</div>
                    </td>
                    <td className="td-muted" style={{ maxWidth: 160 }}>
                      <div className="truncate">{o.items.map(i => i.name).join(", ")}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: "uppercase" }}>
                        {o.channel.replace("_"," ")}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-dark)" }}>
                        {"₹"+o.total.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        o.status === "DELIVERED" ? "badge-green"
                        : o.status === "OUT_FOR_DELIVERY" ? "badge-blue"
                        : o.status === "PROCESSING" ? "badge-amber"
                        : "badge-red"
                      }`}>
                        {o.status.replace(/_/g," ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operations Status */}
        <div className="card card-p" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Operations Status</div>
              <div className="section-sub">Live clinical activity</div>
            </div>
          </div>

          {/* Multi-color progress bar */}
          <div>
            <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: 2 }}>
              <div style={{ flex: 65, background: "#10b981", borderRadius: 99 }} />
              <div style={{ flex: 18, background: "#6366f1", borderRadius: 99 }} />
              <div style={{ flex: 12, background: "#f59e0b", borderRadius: 99 }} />
              <div style={{ flex: 5,  background: "#ec4899", borderRadius: 99 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {[
                { label: "Delivered", color: "#10b981" },
                { label: "In-Transit", color: "#6366f1" },
                { label: "Processing", color: "#f59e0b" },
                { label: "Pending", color: "#ec4899" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                  <span className="dot" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* 2×2 status grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Active",      value: 289, color: "#10b981", dotClass: "dot-green" },
              { label: "In-Transit",  value: 32,  color: "#6366f1", dotClass: "dot-blue" },
              { label: "Processing",  value: 18,  color: "#f59e0b", dotClass: "dot-amber" },
              { label: "Teleconsult", value: 14,  color: "#ec4899", dotClass: "dot-purple" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "14px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--bg-alt)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  <span className={`dot ${s.dotClass}`} />
                  {s.label}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "var(--text-dark)", letterSpacing: "-.03em" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Review Pending Prescriptions", href: "/prescriptions", count: pendingRxCount },
              { label: "Low Stock Alerts", href: "/inventory", count: lowStockCount },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--primary-border)", background: "var(--primary-light)",
                  textDecoration: "none", transition: "var(--transition)",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>{l.label}</span>
                <span style={{
                  background: "var(--primary)", color: "#fff",
                  fontSize: 11, fontWeight: 800, padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                }}>
                  {l.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
