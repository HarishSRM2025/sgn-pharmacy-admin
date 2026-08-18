"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function DoctorsPage() {
  return (
    <div className="card card-p anim-fade-up" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--bg-alt)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Stethoscope style={{ width: 28, height: 28, color: "var(--primary)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text-dark)" }}>
        Teleconsultation Module
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 440, margin: "8px auto 20px" }}>
        Doctor teleconsultations are currently managed through hospital partner integrations. Core focus is on Retail Outlets, Stock, and Prescription fulfillment.
      </p>
      <Link href="/prescriptions" className="btn btn-primary btn-sm">
        Go to Prescription Verification
      </Link>
    </div>
  );
}
