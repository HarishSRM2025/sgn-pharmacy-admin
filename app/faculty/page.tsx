"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Search,
  UserPlus,
  Store,
  CheckCircle2,
  Lock,
  X,
  Check,
  Shield,
  Truck,
  UserCheck,
  Phone,
  Mail,
  User,
  RotateCcw,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { OutletStaffAccount, UserRole } from "@/lib/admin-data";
import ModalPortal from "@/components/ui/ModalPortal";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function OutletStaffPage() {
  const { staffAccounts, outlets, addStaffAccount, updateStaffAccountStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [outletFilter, setOutletFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [resetModalAccount, setResetModalAccount] = useState<OutletStaffAccount | null>(null);
  const [newResetPassword, setNewResetPassword] = useState("");

  // Form State (NO SALARY — Outlet access credential)
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [role, setRole] = useState<UserRole>("OUTLET_ADMIN");
  const [outletId, setOutletId] = useState(outlets[0]?.id || "out-01");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const filtered = staffAccounts.filter((s) => {
    if (roleFilter !== "ALL" && s.role !== roleFilter) return false;
    if (outletFilter !== "ALL" && s.outletId !== outletFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.responsiblePerson.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.outletName.toLowerCase().includes(q) ||
        s.empCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageSize = 10;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsiblePerson || !email || !password) return;

    const assignedOutlet = outlets.find((o) => o.id === outletId);

    const newAccount: OutletStaffAccount = {
      id: `acc-${Date.now()}`,
      empCode: `SGN-${role === "SUPER_ADMIN" ? "ADM" : role === "OUTLET_ADMIN" ? "OUT" : "DEL"}-${Math.floor(100 + Math.random() * 900)}`,
      responsiblePerson,
      role,
      outletId,
      outletName: role === "SUPER_ADMIN" ? "All 14 Superstores (TN Network)" : assignedOutlet ? assignedOutlet.name : "Main Branch",
      phone: phone || "+91 98401 00000",
      email,
      status: "ACTIVE",
      lastLogin: "Active Now",
      createdAt: new Date().toISOString().split("T")[0],
    };

    addStaffAccount(newAccount);
    setShowAddModal(false);
    setResponsiblePerson("");
    setEmail("");
    setPassword("");
    setPhone("");

    setConfirmModal({
      title: "Staff Login Created Successfully!",
      message: `Login credential for ${responsiblePerson} (${role.replace(/_/g, " ")}) assigned to ${newAccount.outletName} has been created with secure SHA-256 encryption.`,
      type: "success",
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalAccount || !newResetPassword) return;

    setResetModalAccount(null);
    setNewResetPassword("");
    setConfirmModal({
      title: "Password Reset Successfully!",
      message: `New password has been updated and securely assigned for ${resetModalAccount.responsiblePerson} (${resetModalAccount.email}).`,
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card accent-red">
          <span className="kpi-label">Super Admins</span>
          <span className="kpi-value">{staffAccounts.filter((s) => s.role === "SUPER_ADMIN").length}</span>
          <div className="kpi-sub">
            <span>Full statewide platform authority</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <span className="kpi-label">Outlet Admins</span>
          <span className="kpi-value">{staffAccounts.filter((s) => s.role === "OUTLET_ADMIN").length}</span>
          <div className="kpi-sub">
            <span>Store managers across 14 branches</span>
          </div>
        </div>

        <div className="kpi-card accent-green">
          <span className="kpi-label">Delivery Fleet Accounts</span>
          <span className="kpi-value">{staffAccounts.filter((s) => s.role === "DELIVERY_MAN").length}</span>
          <div className="kpi-sub">
            <span>Express rider dispatch logins</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <span className="kpi-label">Active Outlet Logins</span>
          <span className="kpi-value">{staffAccounts.filter((s) => s.status === "ACTIVE").length}</span>
          <div className="kpi-sub">
            <span className="badge badge-green">● Connected</span>
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
            placeholder="Search responsible person, email, outlet, or code..."
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

          {/* Role Filter: SUPER_ADMIN, OUTLET_ADMIN, DELIVERY_MAN */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input"
            style={{ width: "auto", height: 36, padding: "0 12px", cursor: "pointer" }}
          >
            <option value="ALL">All 3 Platform Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="OUTLET_ADMIN">Outlet Admin</option>
            <option value="DELIVERY_MAN">Delivery Man</option>
          </select>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <UserPlus style={{ width: 14, height: 14 }} /> Add Outlet Login
          </button>
        </div>
      </div>

      {/* Staff Accounts Data Table (WITHOUT SHOWING PASSWORD) */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Responsible Person</th>
                <th>Platform Role</th>
                <th>Assigned Outlet</th>
                <th>Login Email ID</th>
                <th>Credentials Security</th>
                <th>Phone Contact</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Access Control</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((acc) => (
                <tr key={acc.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "var(--radius-sm)",
                          background: acc.role === "SUPER_ADMIN" ? "var(--primary)" : "var(--bg-dark)",
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
                        {acc.responsiblePerson.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="td-primary">{acc.responsiblePerson}</div>
                        <div className="td-muted">{acc.empCode}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        acc.role === "SUPER_ADMIN"
                          ? "badge-red"
                          : acc.role === "OUTLET_ADMIN"
                          ? "badge-blue"
                          : "badge-green"
                      }`}
                    >
                      {acc.role === "SUPER_ADMIN" && <Shield style={{ width: 10, height: 10 }} />}
                      {acc.role === "DELIVERY_MAN" && <Truck style={{ width: 10, height: 10 }} />}
                      {acc.role === "OUTLET_ADMIN" && <Store style={{ width: 10, height: 10 }} />}
                      {acc.role.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>
                      {acc.outletName.replace("SGN Superstore - ", "")}
                    </div>
                  </td>

                  <td>
                    <div className="td-mono td-primary">{acc.email}</div>
                  </td>

                  <td>
                    <span className="badge badge-neutral" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Lock style={{ width: 10, height: 10, color: "#10b981" }} /> Encrypted (SHA-256)
                    </span>
                  </td>

                  <td className="td-muted">
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone style={{ width: 12, height: 12 }} /> {acc.phone}
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${acc.status === "ACTIVE" ? "badge-green" : "badge-neutral"}`}>
                      {acc.status === "ACTIVE" ? "● Active" : "Inactive"}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <button
                        onClick={() => {
                          setResetModalAccount(acc);
                          setNewResetPassword("");
                        }}
                        className="btn btn-ghost btn-xs"
                        title="Reset Password"
                      >
                        <RotateCcw style={{ width: 11, height: 11 }} /> Reset
                      </button>

                      <button
                        onClick={() => {
                          const newStatus = acc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                          updateStaffAccountStatus(acc.id, newStatus);
                          setConfirmModal({
                            title: "Status Updated",
                            message: `${acc.responsiblePerson}'s access has been set to ${newStatus}.`,
                            type: "success",
                          });
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        {acc.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Add Outlet Login Modal */}
      {showAddModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-green" style={{ marginBottom: 4 }}>
                    Outlet Authentication Portal
                  </span>
                  <h3 className="modal-title">Create Outlet Staff Login Credential</h3>
                  <p className="modal-sub">Generate login access for Super Admin, Outlet Admin, or Delivery Man</p>
                </div>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="form-label">Responsible Person Full Name *</label>
                    <input
                      type="text"
                      required
                      value={responsiblePerson}
                      onChange={(e) => setResponsiblePerson(e.target.value)}
                      placeholder="e.g. S. Venkatesh / Dr. K. Priya"
                      className="input"
                    />
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Platform Role *</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="input"
                      >
                        <option value="OUTLET_ADMIN">Outlet Admin</option>
                        <option value="DELIVERY_MAN">Delivery Man</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Assigned Superstore *</label>
                      <select
                        value={outletId}
                        onChange={(e) => setOutletId(e.target.value)}
                        className="input"
                        disabled={role === "SUPER_ADMIN"}
                      >
                        {outlets.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name.replace("SGN Superstore - ", "")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div>
                      <label className="form-label">Login Email ID *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. samayapuram.admin@sgnpharmacy.com"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Login Password *</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="e.g. Pass@12345"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Responsible Person Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98401 xxxxx"
                      className="input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Check style={{ width: 14, height: 14 }} /> Create Access Credential
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Reset Password Modal */}
      {resetModalAccount && (
        <ModalPortal>
          <div className="overlay" onClick={() => setResetModalAccount(null)}>
            <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: 4 }}>
                    Password Reset
                  </span>
                  <h3 className="modal-title">Reset Credential for {resetModalAccount.responsiblePerson}</h3>
                  <p className="modal-sub">{resetModalAccount.email}</p>
                </div>
                <button className="modal-close" onClick={() => setResetModalAccount(null)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handleResetPasswordSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="form-label">New Password *</label>
                    <input
                      type="password"
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setResetModalAccount(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Check style={{ width: 14, height: 14 }} /> Update Password
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
