"use client";

import { useState } from "react";
import Link from "next/link";
import type { Submission, LineItem, ServiceType, TAT, LogisticsMethod, SubmissionStatus, ItemType, Shape, ColorGrade, ClarityGrade, CutGrade, PolishSymmetryGrade } from "@/app/components/gem-lab/types";

const SHAPES: Shape[] = ["Round Brilliant","Princess","Cushion","Oval","Pear","Emerald","Heart","Marquise","Radiant","Asscher","Other"];
const COLORS: ColorGrade[] = ["D","E","F","G","H","I","J","K","L","M","N","O-P","Q-R","S-T","U-V","W-X","Y-Z","Fancy Yellow","Fancy Pink","Fancy Blue","Fancy Green","Fancy Red","Fancy Orange","Fancy Brown","N/A"];
const CLARITY: ClarityGrade[] = ["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3","N/A"];
const GRADES: CutGrade[] = ["Excellent","Very Good","Good","Fair","Poor","N/A"];

const STATUS_PILL: Record<SubmissionStatus, { bg: string; text: string; dot: string }> = {
  "Pending":     { bg: "#fef9ec", text: "#b45309", dot: "#f59e0b" },
  "In Progress": { bg: "#eef6ff", text: "#1d6fa8", dot: "#38bdf8" },
  "Completed":   { bg: "#edfaf4", text: "#087443", dot: "#34d399" },
  "On Hold":     { bg: "#fff0f0", text: "#b42020", dot: "#f87171" },
  "Dispatched":  { bg: "#f3f0ff", text: "#5b21b6", dot: "#a78bfa" },
};

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    itemType: "Loose Stone", weightValue: "", weightUnit: "ct",
    length: "", width: "", depth: "",
    shape: "Round Brilliant", colorGrade: "D", clarityGrade: "FL",
    cutGrade: "Excellent", polish: "Excellent", symmetry: "Excellent", remarks: "",
  };
}

const INIT: Submission = {
  id: "1", referenceId: "GL-2024-00142",
  clientName: "Mehta Jewellers Pvt Ltd", membershipId: "MBR-0042",
  gstNumber: "29AABCM1234A1Z5", submittedAt: new Date().toISOString(),
  serviceType: "Diamond Grading", tat: "Express",
  logistics: "In-person Pickup", status: "In Progress", totalItems: 2,
  lineItems: [
    { id: "i1", itemType: "Loose Stone", weightValue: "1.02", weightUnit: "ct", length: "6.43", width: "6.46", depth: "3.96", shape: "Round Brilliant", colorGrade: "E", clarityGrade: "VVS1", cutGrade: "Excellent", polish: "Excellent", symmetry: "Very Good", remarks: "No fluorescence" },
    { id: "i2", itemType: "Studded Jewelry", weightValue: "4.85", weightUnit: "g", length: "18.00", width: "12.00", depth: "5.50", shape: "Oval", colorGrade: "G", clarityGrade: "VS2", cutGrade: "Very Good", polish: "Very Good", symmetry: "Good", remarks: "Platinum prong setting" },
  ],
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "10px", color: "#9b93c9",
  letterSpacing: "0.12em", fontWeight: 600,
  textTransform: "uppercase", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#f5f3ff",
  border: "1px solid #ede9ff", borderRadius: "9px",
  padding: "9px 12px", fontSize: "13px", color: "#1a1240",
  outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  width: "100%", background: "#f5f3ff",
  border: "1px solid #ede9ff", borderRadius: "9px",
  padding: "9px 12px", fontSize: "13px", color: "#4f3cc9",
  fontWeight: 600, outline: "none", cursor: "pointer",
};

const tdSelectStyle: React.CSSProperties = {
  background: "#f5f3ff", border: "1px solid #ede9ff",
  borderRadius: "7px", padding: "6px 8px", fontSize: "11px",
  color: "#4f3cc9", fontWeight: 600, outline: "none", width: "100%", cursor: "pointer",
};

const tdInputStyle: React.CSSProperties = {
  background: "#f5f3ff", border: "1px solid #ede9ff",
  borderRadius: "7px", padding: "6px 8px", fontSize: "11px",
  color: "#1a1240", outline: "none", width: "100%", boxSizing: "border-box" as const,
};

export default function DetailPage() {
  const [form, setForm] = useState<Submission>(INIT);
  const [saved, setSaved] = useState(false);

  function setHeader<K extends keyof Submission>(k: K, v: Submission[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function addItem() {
    setForm(f => {
      const items = [...f.lineItems, newItem()];
      return { ...f, lineItems: items, totalItems: items.length };
    });
  }

  function removeItem(id: string) {
    setForm(f => {
      const items = f.lineItems.filter(i => i.id !== id);
      return { ...f, lineItems: items, totalItems: items.length };
    });
  }

  function updateItem(id: string, key: keyof LineItem, val: string) {
    setForm(f => ({
      ...f,
      lineItems: f.lineItems.map(i => i.id === id ? { ...i, [key]: val } : i),
    }));
    setSaved(false);
  }

  function save() {
    console.log("Save:", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const pill = STATUS_PILL[form.status];

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #ede9ff",
    borderRadius: "14px",
    overflow: "hidden",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 12px", textAlign: "left",
    fontSize: "10px", letterSpacing: "0.12em",
    color: "#9b93c9", fontWeight: 600,
    whiteSpace: "nowrap", background: "#faf8ff",
    textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", color: "#1a1240", fontFamily: "system-ui, sans-serif" }}>

      {/* NAV */}
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
            cursor: "pointer",
          }}>{t}</span>
        ))}

        {/* Breadcrumb */}
        <div style={{ marginLeft: "20px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <span style={{ color: "#c4bee8" }}>/</span>
          <Link href="/submissions" style={{ color: "#9b93c9", textDecoration: "none" }}>Submissions</Link>
          <span style={{ color: "#c4bee8" }}>/</span>
          <span style={{ color: "#7c5cfc", fontFamily: "monospace", fontWeight: 600 }}>{form.referenceId}</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Status badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: pill.bg, color: pill.text,
            fontSize: "10px", fontWeight: 600, padding: "4px 10px",
            borderRadius: "20px", whiteSpace: "nowrap",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: pill.dot, display: "inline-block" }} />
            {form.status}
          </span>
          {/* Status changer */}
          <select value={form.status} onChange={e => setHeader("status", e.target.value as SubmissionStatus)} style={{
            background: "#f5f3ff", border: "1px solid #ede9ff",
            borderRadius: "9px", padding: "6px 10px", fontSize: "11px",
            color: "#4f3cc9", fontWeight: 600, outline: "none", cursor: "pointer",
          }}>
            {(["Pending","In Progress","Completed","On Hold","Dispatched"] as SubmissionStatus[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={save} style={{
            background: saved ? "#087443" : "#7c5cfc",
            color: "#fff",
            fontWeight: 500, fontSize: "12px", border: "none",
            padding: "8px 20px", borderRadius: "9px", cursor: "pointer",
            transition: "background 0.3s",
          }}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 28px 48px" }}>

        {/* PAGE TITLE */}
        <div style={{ marginBottom: "22px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 500, color: "#1a1240", letterSpacing: "-0.01em", lineHeight: 1.2, margin: 0 }}>
            Submission Detail
          </h1>
          <p style={{ fontSize: "12px", color: "#9b93c9", fontFamily: "monospace", marginTop: "4px", marginBottom: 0 }}>
            {form.referenceId} · {form.totalItems} item{form.totalItems !== 1 ? "s" : ""}
          </p>
        </div>

        {/* HEADER SECTION */}
        <div style={{ ...cardStyle, marginBottom: "16px" }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #f0ecff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#faf8ff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#9b93c9", fontWeight: 600, textTransform: "uppercase" }}>
                Submission Header
              </span>
              <span style={{
                fontFamily: "monospace", fontSize: "11px", color: "#7c5cfc",
                background: "#f3f0ff", border: "1px solid #ede9ff",
                padding: "2px 10px", borderRadius: "20px",
              }}>{form.referenceId}</span>
            </div>
            <div style={{ display: "flex", gap: "20px", fontSize: "11px", color: "#b8b2d8", fontFamily: "monospace" }}>
              <span>Total Items: <strong style={{ color: "#4f3cc9" }}>{form.totalItems}</strong></span>
              <span>Submitted: {new Date(form.submittedAt).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div style={{ padding: "24px 16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { label: "Client Name",      key: "clientName"   as const },
              { label: "Membership ID",    key: "membershipId" as const },
              { label: "GST / Tax Number", key: "gstNumber"    as const },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  value={form[f.key] as string}
                  onChange={e => setHeader(f.key, e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "#7c5cfc")}
                  onBlur={e => (e.target.style.borderColor = "#ede9ff")}
                />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Service Type</label>
              <select value={form.serviceType} onChange={e => setHeader("serviceType", e.target.value as ServiceType)} style={selectStyle}>
                {(["Diamond Grading","Colored Stone Analysis","Jewelry Appraisal","Pearl Certification","Synthetic Detection"] as ServiceType[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Turnaround Time (TAT)</label>
              <select value={form.tat} onChange={e => setHeader("tat", e.target.value as TAT)} style={selectStyle}>
                {(["Normal","Express","Same-day"] as TAT[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Return / Logistics</label>
              <select value={form.logistics} onChange={e => setHeader("logistics", e.target.value as LogisticsMethod)} style={selectStyle}>
                {(["In-person Pickup","Insured Courier"] as LogisticsMethod[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div style={cardStyle}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #f0ecff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#faf8ff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#9b93c9", fontWeight: 600, textTransform: "uppercase" }}>
                Line Items
              </span>
              <span style={{
                fontSize: "10px", color: "#6b5fd1",
                background: "#f3f0ff", border: "1px solid #ede9ff",
                padding: "2px 10px", borderRadius: "20px", fontFamily: "monospace",
              }}>
                {form.lineItems.length} stone{form.lineItems.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button onClick={addItem} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#7c5cfc", color: "#fff",
              fontWeight: 500, fontSize: "11px", border: "none",
              padding: "7px 14px", borderRadius: "9px", cursor: "pointer",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1 5h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Add Line Item
            </button>
          </div>

          {form.lineItems.length === 0 ? (
            <div style={{ padding: "64px", textAlign: "center" }}>
              <p style={{ color: "#b8b2d8", marginBottom: "12px", fontSize: "14px" }}>No line items yet</p>
              <button onClick={addItem} style={{ background: "none", border: "none", color: "#7c5cfc", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
                Add your first stone
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0ecff" }}>
                    {["#","Item Type","Weight","Dimensions (L×W×D mm)","Shape","Color","Clarity","Cut","Polish","Symmetry","Remarks",""].map((h, i) => (
                      <th key={i} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.lineItems.map((item, idx) => (
                    <tr key={item.id}
                      style={{ borderBottom: "1px solid #f8f6ff", transition: "background 0.12s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#faf8ff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{ fontFamily: "monospace", color: "#b8b2d8", fontSize: "11px" }}>{idx + 1}</span>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "130px" }}>
                        <select value={item.itemType} onChange={e => updateItem(item.id, "itemType", e.target.value)} style={tdSelectStyle}>
                          {(["Loose Stone","Studded Jewelry"] as ItemType[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input type="number" value={item.weightValue} onChange={e => updateItem(item.id, "weightValue", e.target.value)} placeholder="0.00" style={{ ...tdInputStyle, flex: 1 }} />
                          <select value={item.weightUnit} onChange={e => updateItem(item.id, "weightUnit", e.target.value)} style={{ ...tdSelectStyle, width: "48px", padding: "6px 4px" }}>
                            <option value="ct">ct</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <input type="number" value={item.length} onChange={e => updateItem(item.id, "length", e.target.value)} placeholder="L" style={{ ...tdInputStyle, width: "50px" }} />
                          <span style={{ color: "#c4bee8", fontSize: "12px" }}>×</span>
                          <input type="number" value={item.width} onChange={e => updateItem(item.id, "width", e.target.value)} placeholder="W" style={{ ...tdInputStyle, width: "50px" }} />
                          <span style={{ color: "#c4bee8", fontSize: "12px" }}>×</span>
                          <input type="number" value={item.depth} onChange={e => updateItem(item.id, "depth", e.target.value)} placeholder="D" style={{ ...tdInputStyle, width: "50px" }} />
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "140px" }}>
                        <select value={item.shape} onChange={e => updateItem(item.id, "shape", e.target.value)} style={tdSelectStyle}>
                          {SHAPES.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "100px" }}>
                        <select value={item.colorGrade} onChange={e => updateItem(item.id, "colorGrade", e.target.value)} style={tdSelectStyle}>
                          {COLORS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "100px" }}>
                        <select value={item.clarityGrade} onChange={e => updateItem(item.id, "clarityGrade", e.target.value)} style={tdSelectStyle}>
                          {CLARITY.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.cutGrade} onChange={e => updateItem(item.id, "cutGrade", e.target.value)} style={tdSelectStyle}>
                          {GRADES.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.polish} onChange={e => updateItem(item.id, "polish", e.target.value)} style={tdSelectStyle}>
                          {(GRADES as PolishSymmetryGrade[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.symmetry} onChange={e => updateItem(item.id, "symmetry", e.target.value)} style={tdSelectStyle}>
                          {(GRADES as PolishSymmetryGrade[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", minWidth: "160px" }}>
                        <input value={item.remarks} onChange={e => updateItem(item.id, "remarks", e.target.value)} placeholder="Notes..." style={tdInputStyle} />
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <button onClick={() => removeItem(item.id)} title="Remove" style={{
                          background: "none", border: "none", color: "#c4bee8",
                          cursor: "pointer", fontSize: "13px", padding: "2px 6px", transition: "color 0.15s",
                        }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.color = "#b42020")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.color = "#c4bee8")}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {form.lineItems.length > 0 && (
            <div style={{
              padding: "11px 16px", borderTop: "1px solid #f0ecff",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#faf8ff",
            }}>
              <button onClick={addItem} style={{ background: "none", border: "none", color: "#7c5cfc", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
                + Add another line item
              </button>
              <span style={{ fontSize: "10px", color: "#c4bee8", fontFamily: "monospace" }}>
                {form.lineItems.length} item{form.lineItems.length !== 1 ? "s" : ""} · total synced to header
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px" }}>
          <Link href="/submissions" style={{ fontSize: "12px", color: "#9b93c9", textDecoration: "none" }}>← Back to Dashboard</Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{
              background: "transparent", border: "1px solid #ede9ff",
              color: "#220de2", fontSize: "12px", padding: "9px 18px",
              borderRadius: "9px", cursor: "pointer", fontWeight: 500,
            }}>Print / Export PDF</button>
            <button onClick={save} style={{
              background: saved ? "#087443" : "#7c5cfc",
              color: "#fff",
              fontWeight: 500, fontSize: "12px", border: "none",
              padding: "9px 24px", borderRadius: "9px", cursor: "pointer",
              transition: "background 0.3s",
            }}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}