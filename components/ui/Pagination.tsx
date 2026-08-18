"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-white)",
        flexWrap: "wrap",
        gap: 12,
        fontSize: 12,
        color: "var(--text-muted)",
        borderBottomLeftRadius: "var(--radius-md)",
        borderBottomRightRadius: "var(--radius-md)",
      }}
    >
      <div>
        Showing <strong style={{ color: "var(--text-dark)" }}>{totalItems === 0 ? 0 : startItem}</strong> to{" "}
        <strong style={{ color: "var(--text-dark)" }}>{endItem}</strong> of{" "}
        <strong style={{ color: "var(--text-dark)" }}>{totalItems}</strong> entries
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            borderRadius: "var(--radius-xs)",
            border: "1px solid var(--border)",
            background: currentPage === 1 ? "var(--bg-alt)" : "var(--bg-white)",
            color: currentPage === 1 ? "var(--text-light)" : "var(--text-dark)",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 12,
            transition: "var(--transition)",
          }}
        >
          <ChevronLeft style={{ width: 13, height: 13 }} /> Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-xs)",
              border: p === currentPage ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: p === currentPage ? "var(--primary)" : "var(--bg-white)",
              color: p === currentPage ? "#ffffff" : "var(--text-dark)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            borderRadius: "var(--radius-xs)",
            border: "1px solid var(--border)",
            background: currentPage === totalPages ? "var(--bg-alt)" : "var(--bg-white)",
            color: currentPage === totalPages ? "var(--text-light)" : "var(--text-dark)",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 12,
            transition: "var(--transition)",
          }}
        >
          Next <ChevronRight style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
}
