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
  "Pending":     { bg: "#2a1f00", text: "#f59e0b", dot: "#f59e0b" },
  "In Progress": { bg: "#001a2e", text: "#38bdf8", dot: "#38bdf8" },
  "Completed":   { bg: "#002a1a", text: "#34d399", dot: "#34d399" },
  "On Hold":     { bg: "#2a0a0a", text: "#f87171", dot: "#f87171" },
  "Dispatched":  { bg: "#1a0a2e", text: "#a78bfa", dot: "#a78bfa" },
};

const TAT_COLOR: Record<TAT, string> = {
  "Normal":   "#71717a",
  "Express":  "#f59e0b",
  "Same-day": "#f87171",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function SubmissionsPage() {
  const [search, setSearch]               = useState("");
  const [fStatus, setFStatus]             = useState<SubmissionStatus | "All">("All");
  const [fService, setFService]           = useState<ServiceType | "All">("All");
  const [fTAT, setFTAT]                   = useState<TAT | "All">("All");
  const [fLogistics, setFLogistics]       = useState<"All" | "In-person Pickup" | "Insured Courier">("All");
  const [sortKey, setSortKey]             = useState<"submittedAt" | "referenceId" | "totalItems">("submittedAt");
  const [sortDir, setSortDir]             = useState<"asc" | "desc">("desc");

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
        sortKey === "totalItems" ? a.totalItems - b.totalItems :
        sortKey === "referenceId" ? a.referenceId.localeCompare(b.referenceId) :
        a.submittedAt.localeCompare(b.submittedAt);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, fStatus, fService, fTAT, fLogistics, sortKey, sortDir]);

  const stats = {
    total: MOCK.length,
    pending: MOCK.filter(s => s.status === "Pending").length,
    inProgress: MOCK.filter(s => s.status === "In Progress").length,
    completed: MOCK.filter(s => s.status === "Completed").length,
  };

  function toggleSort(k: typeof sortKey) {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  const selectStyle: React.CSSProperties = {
    background: "#181c24",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#a1a1aa",
    outline: "none",
    cursor: "pointer",
  };

  const inputStyle: React.CSSProperties = {
    background: "#181c24",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "8px",
    padding: "8px 12px 8px 36px",
    fontSize: "12px",
    color: "#e2e0da",
    outline: "none",
    width: "100%",
    minWidth: "220px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b0e", color: "#e2e0da", fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="anim-fade-in" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(14,15,20,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "8px",
        padding: "0 32px", height: "52px",
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: "#e8c97a", letterSpacing: "0.03em", marginRight: "24px", whiteSpace: "nowrap" }}>
          ◇ GemLab IMS
        </span>
        {(["SUBMISSIONS", "CLIENTS", "REPORTS"] as const).map((t, i) => (
          <span key={t} style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
            color: i === 0 ? "#e8c97a" : "#52525b",
            borderBottom: i === 0 ? "2px solid #c9a84c" : "2px solid transparent",
            padding: "0 12px", height: "52px", display: "flex", alignItems: "center",
            cursor: "pointer", transition: "color 0.2s",
          }}>{t}</span>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Link href="/submissions/new" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#c9a84c", color: "#0f0900",
            fontWeight: 700, fontSize: "11px", letterSpacing: "0.06em",
            padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
            transition: "background 0.2s",
          }}>＋ New Submission</Link>
        </div>
      </header>

      <div style={{ padding: "32px 32px 48px", maxWidth: "100%" }}>

        {/* ── PAGE TITLE ── */}
        <div className="anim-fade-up" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: 300, color: "#f4f0e8", letterSpacing: "0.01em", lineHeight: 1.2 }}>
            Submission History
          </h1>
          <p style={{ fontSize: "11px", color: "#52525b", fontFamily: "monospace", marginTop: "6px" }}>
            {rows.length} of {MOCK.length} records
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="anim-fade-up d1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "TOTAL SUBMISSIONS", value: stats.total,      accent: "#c9a84c" },
            { label: "PENDING",           value: stats.pending,    accent: "#f59e0b" },
            { label: "IN PROGRESS",       value: stats.inProgress, accent: "#38bdf8" },
            { label: "COMPLETED",         value: stats.completed,  accent: "#34d399" },
          ].map((s, i) => (
            <div key={s.label} className={`anim-fade-up d${i + 1}`} style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${s.accent}`,
              borderRadius: "12px",
              padding: "20px 22px",
            }}>
              <p style={{ fontSize: "9px", color: "#52525b", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: "10px" }}>{s.label}</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "40px", fontWeight: 300, color: "#f4f0e8", lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="anim-fade-up d3" style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "14px 16px",
          marginBottom: "16px",
          display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#52525b", fontSize: "14px" }}>⌕</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ref ID, client, GST..."
              style={inputStyle}
            />
          </div>
          <select value={fStatus} onChange={e => setFStatus(e.target.value as typeof fStatus)} style={selectStyle}>
            <option value="All">All Statuses</option>
            {(["Pending","In Progress","Completed","On Hold","Dispatched"] as SubmissionStatus[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={fService} onChange={e => setFService(e.target.value as typeof fService)} style={selectStyle}>
            <option value="All">All Services</option>
            {(["Diamond Grading","Colored Stone Analysis","Jewelry Appraisal","Pearl Certification","Synthetic Detection"] as ServiceType[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={fTAT} onChange={e => setFTAT(e.target.value as typeof fTAT)} style={selectStyle}>
            <option value="All">All TAT</option>
            <option value="Normal">Normal</option>
            <option value="Express">Express</option>
            <option value="Same-day">Same-day</option>
          </select>
          <select value={fLogistics} onChange={e => setFLogistics(e.target.value as typeof fLogistics)} style={selectStyle}>
            <option value="All">All Logistics</option>
            <option value="In-person Pickup">In-person Pickup</option>
            <option value="Insured Courier">Insured Courier</option>
          </select>
          {(search || fStatus !== "All" || fService !== "All" || fTAT !== "All" || fLogistics !== "All") && (
            <button onClick={() => { setSearch(""); setFStatus("All"); setFService("All"); setFTAT("All"); setFLogistics("All"); }}
              style={{ background: "none", border: "none", color: "#71717a", fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="anim-fade-up d4" style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {([
                    { label: "REFERENCE ID",  key: "referenceId"  as const },
                    { label: "CLIENT",         key: null },
                    { label: "SUBMITTED",      key: "submittedAt" as const },
                    { label: "SERVICE",        key: null },
                    { label: "TAT",            key: null },
                    { label: "LOGISTICS",      key: null },
                    { label: "ITEMS",          key: "totalItems"  as const },
                    { label: "STATUS",         key: null },
                    { label: "",               key: null },
                  ]).map((col, i) => (
                    <th key={i} onClick={() => col.key && toggleSort(col.key)} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: "9px", letterSpacing: "0.14em", color: "#52525b",
                      fontWeight: 600, fontFamily: "monospace", whiteSpace: "nowrap",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none",
                    }}>
                      {col.label}
                      {col.key && <span style={{ marginLeft: "4px", opacity: 0.5 }}>{sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#52525b" }}>No results match your filters</td></tr>
                ) : rows.map((row, i) => {
                  const pill = STATUS_PILL[row.status];
                  return (
                    <tr key={row.id} className={`anim-fade-up d${Math.min(i + 1, 8)}`} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#c9a84c" }}>{row.referenceId}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ color: "#e2e0da", fontWeight: 500, marginBottom: "2px" }}>{row.clientName}</p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#52525b" }}>{row.membershipId}</p>
                      </td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <p style={{ color: "#a1a1aa" }}>{fmtDate(row.submittedAt)}</p>
                        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#52525b" }}>{fmtTime(row.submittedAt)}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#a1a1aa", whiteSpace: "nowrap" }}>{row.serviceType}</td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "11px", color: TAT_COLOR[row.tat] }}>{row.tat}</span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#71717a", whiteSpace: "nowrap" }}>
                        {row.logistics === "Insured Courier" ? "✈ Courier" : "🏢 Pickup"}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{ fontFamily: "monospace", color: "#a1a1aa" }}>{row.totalItems}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          background: pill.bg, color: pill.text,
                          fontSize: "10px", fontWeight: 600, padding: "4px 10px",
                          borderRadius: "20px", whiteSpace: "nowrap",
                        }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: pill.dot, display: "inline-block" }} />
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/submissions/${row.id}`} style={{
                          fontSize: "11px", color: "#c9a84c", textDecoration: "none",
                          fontWeight: 600, opacity: 0, transition: "opacity 0.2s",
                          whiteSpace: "nowrap",
                        }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "1")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "0")}
                        >View →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex", justifyContent: "space-between",
            fontSize: "10px", color: "#3f3f46", fontFamily: "monospace",
          }}>
            <span>Showing {rows.length} record{rows.length !== 1 ? "s" : ""}</span>
            <span>GemLab IMS · v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}