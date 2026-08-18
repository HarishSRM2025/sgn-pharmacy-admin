"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import ModalPortal from "./ModalPortal";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "warning" | "info" | "danger";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 style={{ width: 24, height: 24, color: "#10b981" }} />;
      case "warning":
      case "danger":
        return <AlertTriangle style={{ width: 24, height: 24, color: "var(--primary)" }} />;
      default:
        return <Info style={{ width: 24, height: 24, color: "#3b82f6" }} />;
    }
  };

  return (
    <ModalPortal>
      <div className="overlay" onClick={onClose}>
        <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header" style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {getIcon()}
              <h3 className="modal-title" style={{ fontSize: 16 }}>{title}</h3>
            </div>
            <button className="modal-close" onClick={onClose}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div className="modal-body" style={{ padding: "18px 20px", fontSize: 13, color: "var(--text-main)", lineHeight: 1.5 }}>
            {message}
          </div>

          <div className="modal-footer" style={{ padding: "12px 20px" }}>
            {cancelText && (
              <button className="btn btn-ghost btn-sm" onClick={onClose}>
                {cancelText}
              </button>
            )}
            <button
              className={`btn ${type === "danger" || type === "warning" ? "btn-primary" : "btn-primary"} btn-sm`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
