"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

export default function DiagnosticsPage() {
  return (
    <div className="card card-p anim-fade-up" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--bg-alt)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Activity style={{ width: 28, height: 28, color: "var(--primary)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text-dark)" }}>
        Diagnostic Lab Operations
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 440, margin: "8px auto 20px" }}>
        Home sample collection and diagnostic testing are managed via partnered NABL certified laboratories.
      </p>
      <Link href="/orders" className="btn btn-primary btn-sm">
        Go to Orders &amp; Delivery
      </Link>
    </div>
  );
}
