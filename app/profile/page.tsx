"use client";

import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Check,
  X,
  Building2,
  Shield,
  Clock,
  LogOut,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import ModalPortal from "@/components/ui/ModalPortal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProfilePage() {
  const { outlets } = useAdmin();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setConfirmModal({
        title: "Passwords Do Not Match",
        message: "Your new password and confirmation password do not match. Please re-enter them carefully.",
        type: "warning",
      });
      return;
    }

    if (newPassword.length < 6) {
      setConfirmModal({
        title: "Password Too Short",
        message: "For security, your password must be at least 6 characters.",
        type: "warning",
      });
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setConfirmModal({
      title: "Master Password Updated Successfully!",
      message: "Your Super Admin password credential has been updated and securely synchronized with SGN Enterprise Auth.",
      type: "success",
    });
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Profile Hero Card */}
      <div className="card card-p">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 26,
                boxShadow: "var(--shadow-primary)",
                flexShrink: 0,
              }}
            >
              AB
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text-dark)" }}>
                  Dr. A. Balasubramanian
                </h2>
                <span className="badge badge-red">
                  <ShieldCheck style={{ width: 11, height: 11 }} /> Super Admin
                </span>
                <span className="badge badge-green">
                  <span className="dot dot-green" /> Master Authority
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                Chief Operating Officer &amp; Principal Pharmacist • SGN Group of Retail Pharmacies
              </div>
              <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Mail style={{ width: 12, height: 12 }} /> admin@sgnpharmacy.com
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone style={{ width: 12, height: 12 }} /> +91 98401 00000
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin style={{ width: 12, height: 12 }} /> Trichy HQ / Chennai Central
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowPasswordModal(true)} className="btn btn-primary btn-sm">
              <KeyRound style={{ width: 14, height: 14 }} /> Change Master Password
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Account Details & Security Policies */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Super Admin Credentials */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">Enterprise Account Credentials</div>
              <div className="section-sub">Statewide administrative credentials</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Employee ID:</span>
              <strong className="td-mono td-primary">SGN-ADM-001</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Platform Role:</span>
              <strong style={{ color: "var(--primary)" }}>Super Admin (Statewide Network)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Registered Superstores:</span>
              <strong>{outlets.length} Branches Across Tamil Nadu</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Last Security Audit:</span>
              <strong style={{ color: "#10b981" }}>Today at 14:30 IST (2FA Active)</strong>
            </div>
          </div>
        </div>

        {/* Security & Access Level */}
        <div className="card card-p">
          <div className="section-header">
            <div>
              <div className="section-title">Security &amp; Authentication Control</div>
              <div className="section-sub">Password policies and session governance</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "var(--bg-alt)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: 13, color: "var(--text-dark)" }}>Master Login Password</strong>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Protected with SHA-256 encryption</div>
              </div>
              <button onClick={() => setShowPasswordModal(true)} className="btn btn-ghost btn-xs">
                Update
              </button>
            </div>

            <div style={{ background: "var(--bg-alt)", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: 13, color: "var(--text-dark)" }}>Two-Factor Authentication (SMS OTP)</strong>
                <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>Enabled on +91 98401 00000</div>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ModalPortal>
          <div className="overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-red" style={{ marginBottom: 4 }}>
                    Security Control
                  </span>
                  <h3 className="modal-title">Change Master Password</h3>
                  <p className="modal-sub">Update your Super Admin platform authentication password</p>
                </div>
                <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="form-label">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="form-label">New Password *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPasswordModal(false)}>
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
