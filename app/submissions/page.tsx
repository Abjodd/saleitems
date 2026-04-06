"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Submission, SubmissionStatus, ServiceType, TAT } from "@/app/components/gem-lab/types";

const MOCK: Submission[] = [
  { id: "1", referenceId: "GL-2024-00142", clientName: "Mehta Jewellers Pvt Ltd", membershipId: "MBR-0042", gstNumber: "29AABCM1234A1Z5", submittedAt: "2024-12-01T09:15:00Z", serviceType: "Diamond Grading", tat: "Express", logistics: "In-person Pickup", status: "Completed", totalItems: 4, lineItems: [] },
  { id: "2", referenceId: "GL-2024-00141", clientName: "Ravi Gems & Co.", membershipId: "MBR-0018", gstNumber: "27AACCR5678B2Z3", submittedAt: "2024-11-30T14:30:00Z", serviceType: "Colored Stone Analysis", tat: "Normal", logistics: "Insured Courier", status: "In Progress", totalItems: 7, lineItems: [] },
  { id: "3", referenceId: "GL-2024-00140", clientName: "Lakshmi Fine Jewels", membershipId: "MBR-0091", gstNumber: "33AABCL9012C3Z8", submittedAt: "2024-11-29T11:00:00Z", serviceType: "Jewelry Appraisal", tat: "Same-day", logistics: "In-person Pickup", status: "Dispatched", totalItems: 2, lineItems: [] },
  { id: "4", referenceId: "GL-2024-00139", clientName: "Solitaire House", membershipId: "MBR-0055", gstNumber: "09AABCS3456D4Z1", submittedAt: "2024-11-28T16:45:00Z", serviceType: "Diamond Grading", tat: "Normal", logistics: "Insured Courier", status: "Pending", totalItems: 12, lineItems: [] },
  { id: "5", referenceId: "GL-2024-00138", clientName: "Ananya Diamond Hub", membershipId: "MBR-0033", gstNumber: "24AABCA7890E5Z6", submittedAt: "2024-11-27T10:20:00Z", serviceType: "Synthetic Detection", tat: "Express", logistics: "In-person Pickup", status: "On Hold", totalItems: 3, lineItems: [] },
  { id: "6", referenceId: "GL-2024-00137", clientName: "Kapoor & Sons Gems", membershipId: "MBR-0077", gstNumber: "07AABCK2345F6Z9", submittedAt: "2024-11-26T13:10:00Z", serviceType: "Pearl Certification", tat: "Normal", logistics: "Insured Courier", status: "Completed", totalItems: 5, lineItems: [] },
];

const STATUS_PILL: Record<SubmissionStatus, { bg: string; text: string; dot: string }> = {
  "Pending":     { bg: "#fef9ec", text: "#b45309", dot: "#f59e0b" },
  "In Progress": { bg: "#eef6ff", text: "#1d6fa8", dot: "#38bdf8" },
  "Completed":   { bg: "#edfaf4", text: "#087443", dot: "#34d399" },
  "On Hold":     { bg: "#fff0f0", text: "#b42020", dot: "#f87171" },
  "Dispatched":  { bg: "#f3f0ff", text: "#5b21b6", dot: "#a78bfa" },
};

const TAT_COLOR: Record<TAT, string> = {
  "Normal":   "#9b93c9",
  "Express":  "#f59e0b",
  "Same-day": "#f87171",
};

const STAT_CARDS = [
  { label: "TOTAL SUBMISSIONS", key: "total" as const,      accent: "linear-gradient(90deg,#f59e0b,#f8c841)" },
  { label: "PENDING",           key: "pending" as const,    accent: "linear-gradient(90deg,#fb923c,#f59e0b)" },
  { label: "IN PROGRESS",       key: "inProgress" as const, accent: "linear-gradient(90deg,#38bdf8,#7c5cfc)" },
  { label: "COMPLETED",         key: "completed" as const,  accent: "linear-gradient(90deg,#34d399,#10b981)" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function SubmissionsPage() {
  const [search, setSearch]         = useState("");
  const [fStatus, setFStatus]       = useState<SubmissionStatus | "All">("All");
  const [fService, setFService]     = useState<ServiceType | "All">("All");
  const [fTAT, setFTAT]             = useState<TAT | "All">("All");
  const [fLogistics, setFLogistics] = useState<"All" | "In-person Pickup" | "Insured Courier">("All");
  const [sortKey, setSortKey]       = useState<"submittedAt" | "referenceId" | "totalItems">("submittedAt");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    return MOCK.filter(s => {
      const q = search.toLowerCase();
      return (
        (!q || s.referenceId.toLowerCase().includes(q) || s.clientName.toLowerCase().includes(q) || s.membershipId.toLowerCase().includes(q)) &&
        (fStatus === "All" || s.status === fStatus) &&
        (fService === "All" || s.serviceType === fService) &&
        (fTAT === "All" || s.tat === fTAT) &&
        (fLogistics === "All" || s.logistics === fLogistics)
      );
    }).sort((a, b) => {
      const cmp =
        sortKey === "totalItems"   ? a.totalItems - b.totalItems :
        sortKey === "referenceId"  ? a.referenceId.localeCompare(b.referenceId) :
        a.submittedAt.localeCompare(b.submittedAt);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, fStatus, fService, fTAT, fLogistics, sortKey, sortDir]);

  const stats = {
    total:      MOCK.length,
    pending:    MOCK.filter(s => s.status === "Pending").length,
    inProgress: MOCK.filter(s => s.status === "In Progress").length,
    completed:  MOCK.filter(s => s.status === "Completed").length,
  };

  const hasFilters = search || fStatus !== "All" || fService !== "All" || fTAT !== "All" || fLogistics !== "All";

  function toggleSort(k: typeof sortKey) {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  function clearFilters() {
    setSearch(""); setFStatus("All"); setFService("All"); setFTAT("All"); setFLogistics("All");
  }

  // ── Shared styles ──────────────────────────────────────────────
  const selectStyle: React.CSSProperties = {
    background: "#f5f3ff",
    border: "1px solid #ede9ff",
    borderRadius: "9px",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#4f3cc9",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
  };

  const thStyle: React.CSSProperties = {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: "#9b93c9",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
    cursor: "pointer",
    userSelect: "none" as const,
    background: "#faf8ff",
    textTransform: "uppercase" as const,
  };

  const tdStyle: React.CSSProperties = { padding: "13px 16px" };

  const sortIcon = (k: typeof sortKey) =>
    sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", color: "#1a1240", fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #e8e4ff",
        display: "flex", alignItems: "center",
        padding: "0 28px", height: "54px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "28px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "linear-gradient(135deg, #7c5cfc, #4f3cc9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,5 13,9 7,13 1,9 1,5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#4f3cc9", letterSpacing: "0.01em" }}>
            GemLab IMS
          </span>
        </div>

        {(["SUBMISSIONS", "CLIENTS", "REPORTS"] as const).map((t, i) => (
          <span key={t} style={{
            fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em",
            color: i === 0 ? "#4f3cc9" : "#9b93c9",
            borderBottom: i === 0 ? "2px solid #7c5cfc" : "2px solid transparent",
            padding: "0 14px", height: "54px",
            display: "flex", alignItems: "center",
            cursor: "pointer", transition: "color 0.15s",
          }}>{t}</span>
        ))}

        <div style={{ marginLeft: "auto" }}>
          <Link href="/submissions/new" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#7c5cfc", color: "#fff",
            fontWeight: 500, fontSize: "12px", letterSpacing: "0.04em",
            padding: "8px 18px", borderRadius: "9px", textDecoration: "none",
            transition: "background 0.2s",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Submission
          </Link>
        </div>
      </header>

      <div style={{ padding: "28px 28px 48px" }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ marginBottom: "22px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 500, color: "#1a1240", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            Submission History
          </h1>
          <p style={{ fontSize: "12px", color: "#9b93c9", fontFamily: "monospace", marginTop: "4px" }}>
            {rows.length} of {MOCK.length} records
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "22px" }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{
              background: "#fff",
              border: "1px solid #ede9ff",
              borderRadius: "14px",
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* top accent bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                background: s.accent,
                borderRadius: "14px 14px 0 0",
              }} />
              <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#0a0a0a", fontWeight: 600, marginBottom: "10px", textTransform: "uppercase" }}>
                {s.label}
              </p>
              <p style={{ fontSize: "38px", fontWeight: 300, color: "#1a1240", lineHeight: 1 }}>
                {stats[s.key]}
              </p>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          background: "#fff",
          border: "1px solid #ede9ff",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#9b93c9" }}>
              <circle cx="6" cy="6" r="4.5" stroke="#9b93c9" strokeWidth="1.5" />
              <path d="M10 10l2.5 2.5" stroke="#9b93c9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ref ID, client, membership..."
              style={{
                background: "#f5f3ff", border: "1px solid #ede9ff", borderRadius: "9px",
                padding: "8px 12px 8px 34px", fontSize: "12px", color: "#1a1240",
                outline: "none", width: "100%",
              }}
            />
          </div>

          <select value={fStatus} onChange={e => setFStatus(e.target.value as typeof fStatus)} style={selectStyle}>
            <option value="All">All Statuses</option>
            {(["Pending", "In Progress", "Completed", "On Hold", "Dispatched"] as SubmissionStatus[]).map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select value={fService} onChange={e => setFService(e.target.value as typeof fService)} style={selectStyle}>
            <option value="All">All Services</option>
            {(["Diamond Grading", "Colored Stone Analysis", "Jewelry Appraisal", "Pearl Certification", "Synthetic Detection"] as ServiceType[]).map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select value={fTAT} onChange={e => setFTAT(e.target.value as typeof fTAT)} style={selectStyle}>
            <option value="All">All TAT</option>
            <option>Normal</option>
            <option>Express</option>
            <option>Same-day</option>
          </select>

          <select value={fLogistics} onChange={e => setFLogistics(e.target.value as typeof fLogistics)} style={selectStyle}>
            <option value="All">All Logistics</option>
            <option value="In-person Pickup">In-person Pickup</option>
            <option value="Insured Courier">Insured Courier</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} style={{
              background: "none", border: "none", color: "#9b93c9",
              fontSize: "11px", cursor: "pointer", textDecoration: "underline",
            }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── TABLE ── */}
        <div style={{ background: "#fff", border: "1px solid #ede9ff", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0ecff" }}>
                  <th style={thStyle} onClick={() => toggleSort("referenceId")}>
                    Reference ID{sortIcon("referenceId")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}>Client</th>
                  <th style={thStyle} onClick={() => toggleSort("submittedAt")}>
                    Submitted{sortIcon("submittedAt")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}>Service</th>
                  <th style={{ ...thStyle, cursor: "default" }}>TAT</th>
                  <th style={{ ...thStyle, cursor: "default" }}>Logistics</th>
                  <th style={{ ...thStyle, textAlign: "center" }} onClick={() => toggleSort("totalItems")}>
                    Items{sortIcon("totalItems")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}>Status</th>
                  <th style={{ ...thStyle, cursor: "default" }} />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#b8b2d8" }}>
                      No results match your filters
                    </td>
                  </tr>
                ) : rows.map(row => {
                  const pill = STATUS_PILL[row.status];
                  return (
                    <tr key={row.id}
                      style={{ borderBottom: "1px solid #f8f6ff", transition: "background 0.12s", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#faf8ff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={tdStyle}>
                        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#7c5cfc", fontWeight: 600 }}>
                          {row.referenceId}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <p style={{ color: "#1a1240", fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>
                          {row.clientName}
                        </p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#b8b2d8" }}>
                          {row.membershipId}
                        </p>
                      </td>
                      <td style={tdStyle}>
                        <p style={{ color: "#3d2f8f" }}>{fmtDate(row.submittedAt)}</p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#b8b2d8" }}>
                          {fmtTime(row.submittedAt)}
                        </p>
                      </td>
                      <td style={{ ...tdStyle, color: "#3d2f8f", whiteSpace: "nowrap" }}>{row.serviceType}</td>
                      <td style={tdStyle}>
                        <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "11px", color: TAT_COLOR[row.tat] }}>
                          {row.tat}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#6b5fd1" }}>
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "5px", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: "11px",
                            background: row.logistics === "Insured Courier" ? "#ede9ff" : "#fef3c7",
                          }}>
                            {row.logistics === "Insured Courier" ? "✈" : "🏢"}
                          </div>
                          {row.logistics === "Insured Courier" ? "Courier" : "Pickup"}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center", fontFamily: "monospace", color: "#3d2f8f", fontWeight: 600 }}>
                        {row.totalItems}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "5px",
                          background: pill.bg, color: pill.text,
                          fontSize: "10px", fontWeight: 600,
                          padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap",
                        }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: pill.dot, display: "inline-block" }} />
                          {row.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <Link href={`/submissions/${row.id}`}
                          style={{ fontSize: "11px", color: "#7c5cfc", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = "underline")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = "none")}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: "11px 16px",
            borderTop: "1px solid #f0ecff",
            display: "flex", justifyContent: "space-between",
            fontSize: "10px", color: "#c4bee8",
            fontFamily: "monospace", background: "#faf8ff",
          }}>
            <span>Showing {rows.length} record{rows.length !== 1 ? "s" : ""}</span>
            <span>GemLab IMS · v1.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}