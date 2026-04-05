"use client";

import { useState } from "react";
import Link from "next/link";
import type { Submission, LineItem, ServiceType, TAT, LogisticsMethod, SubmissionStatus, ItemType, Shape, ColorGrade, ClarityGrade, CutGrade, PolishSymmetryGrade } from "@/app/components/gem-lab/types";

const SHAPES: Shape[] = ["Round Brilliant","Princess","Cushion","Oval","Pear","Emerald","Heart","Marquise","Radiant","Asscher","Other"];
const COLORS: ColorGrade[] = ["D","E","F","G","H","I","J","K","L","M","N","O-P","Q-R","S-T","U-V","W-X","Y-Z","Fancy Yellow","Fancy Pink","Fancy Blue","Fancy Green","Fancy Red","Fancy Orange","Fancy Brown","N/A"];
const CLARITY: ClarityGrade[] = ["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3","N/A"];
const GRADES: CutGrade[] = ["Excellent","Very Good","Good","Fair","Poor","N/A"];

const STATUS_PILL: Record<SubmissionStatus, { bg: string; text: string; dot: string }> = {
  "Pending":     { bg: "#2a1f00", text: "#f59e0b", dot: "#f59e0b" },
  "In Progress": { bg: "#001a2e", text: "#38bdf8", dot: "#38bdf8" },
  "Completed":   { bg: "#002a1a", text: "#34d399", dot: "#34d399" },
  "On Hold":     { bg: "#2a0a0a", text: "#f87171", dot: "#f87171" },
  "Dispatched":  { bg: "#1a0a2e", text: "#a78bfa", dot: "#a78bfa" },
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

const cardStyle: React.CSSProperties = {
  background: "#111318",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  overflow: "hidden",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "9px", color: "#52525b",
  letterSpacing: "0.14em", fontFamily: "monospace", marginBottom: "6px", fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#181c24",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
  padding: "9px 12px", fontSize: "12px", color: "#e2e0da",
  outline: "none", transition: "border-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  width: "100%", background: "#181c24",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
  padding: "9px 12px", fontSize: "12px", color: "#a1a1aa",
  outline: "none", cursor: "pointer",
};

const tdSelectStyle: React.CSSProperties = {
  background: "#181c24", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px", padding: "6px 8px", fontSize: "11px",
  color: "#a1a1aa", outline: "none", width: "100%",
};

const tdInputStyle: React.CSSProperties = {
  background: "#181c24", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px", padding: "6px 8px", fontSize: "11px",
  color: "#e2e0da", outline: "none", width: "100%",
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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b0e", color: "#e2e0da", fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="anim-fade-in" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(14,15,20,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "8px",
        padding: "0 32px", height: "52px",
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: "#e8c97a", letterSpacing: "0.03em", marginRight: "8px" }}>◇ GemLab IMS</span>
        <span style={{ color: "#3f3f46", fontSize: "16px" }}>/</span>
        <Link href="/submissions" style={{ fontSize: "12px", color: "#71717a", textDecoration: "none" }}>Submissions</Link>
        <span style={{ color: "#3f3f46", fontSize: "16px" }}>/</span>
        <span style={{ fontSize: "12px", color: "#c9a84c", fontFamily: "monospace" }}>{form.referenceId}</span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Status badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: pill.bg, color: pill.text,
            fontSize: "10px", fontWeight: 600, padding: "5px 12px",
            borderRadius: "20px",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: pill.dot }} />
            {form.status}
          </span>
          {/* Status changer */}
          <select value={form.status} onChange={e => setHeader("status", e.target.value as SubmissionStatus)} style={{
            background: "#181c24", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", padding: "6px 10px", fontSize: "11px",
            color: "#a1a1aa", outline: "none", cursor: "pointer",
          }}>
            {(["Pending","In Progress","Completed","On Hold","Dispatched"] as SubmissionStatus[]).map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={save} style={{
            background: saved ? "#16a34a" : "#c9a84c",
            color: saved ? "#fff" : "#0f0900",
            fontWeight: 700, fontSize: "12px", border: "none",
            padding: "8px 20px", borderRadius: "8px", cursor: "pointer",
            transition: "background 0.3s",
          }}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </header>

      <div style={{ padding: "32px", maxWidth: "100%" }}>

        {/* ── HEADER SECTION ── */}
        <div className="anim-fade-up" style={{ ...cardStyle, marginBottom: "20px" }}>
          {/* Section header bar */}
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "9px", letterSpacing: "0.14em", color: "#52525b", fontFamily: "monospace", fontWeight: 600 }}>SUBMISSION HEADER</span>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#c9a84c", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", padding: "2px 10px", borderRadius: "20px" }}>{form.referenceId}</span>
            </div>
            <div style={{ display: "flex", gap: "20px", fontSize: "11px", color: "#52525b", fontFamily: "monospace" }}>
              <span>Total Items: <strong style={{ color: "#c9a84c" }}>{form.totalItems}</strong></span>
              <span>Submitted: {new Date(form.submittedAt).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Fields grid */}
          <div style={{ padding: "24px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { label: "CLIENT NAME",       key: "clientName"  as const },
              { label: "MEMBERSHIP ID",     key: "membershipId" as const },
              { label: "GST / TAX NUMBER",  key: "gstNumber"   as const },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.key] as string} onChange={e => setHeader(f.key, e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
            ))}
            <div>
              <label style={labelStyle}>SERVICE TYPE</label>
              <select value={form.serviceType} onChange={e => setHeader("serviceType", e.target.value as ServiceType)} style={selectStyle}>
                {(["Diamond Grading","Colored Stone Analysis","Jewelry Appraisal","Pearl Certification","Synthetic Detection"] as ServiceType[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>TURNAROUND TIME (TAT)</label>
              <select value={form.tat} onChange={e => setHeader("tat", e.target.value as TAT)} style={selectStyle}>
                {(["Normal","Express","Same-day"] as TAT[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>RETURN / LOGISTICS</label>
              <select value={form.logistics} onChange={e => setHeader("logistics", e.target.value as LogisticsMethod)} style={selectStyle}>
                {(["In-person Pickup","Insured Courier"] as LogisticsMethod[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── LINE ITEMS ── */}
        <div className="anim-fade-up d2" style={cardStyle}>
          {/* Section header bar */}
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "9px", letterSpacing: "0.14em", color: "#52525b", fontFamily: "monospace", fontWeight: 600 }}>LINE ITEMS</span>
              <span style={{ fontSize: "10px", color: "#71717a", background: "#1e222b", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 10px", borderRadius: "20px", fontFamily: "monospace" }}>
                {form.lineItems.length} stone{form.lineItems.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button onClick={addItem} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#c9a84c", color: "#0f0900",
              fontWeight: 700, fontSize: "11px", border: "none",
              padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
            }}>＋ Add Line Item</button>
          </div>

          {form.lineItems.length === 0 ? (
            <div style={{ padding: "64px", textAlign: "center" }}>
              <p style={{ color: "#52525b", marginBottom: "12px" }}>No line items yet</p>
              <button onClick={addItem} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>Add your first stone</button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["#","ITEM TYPE","WEIGHT","DIMENSIONS (L×W×D mm)","SHAPE","COLOR","CLARITY","CUT","POLISH","SYMMETRY","REMARKS",""].map((h, i) => (
                      <th key={i} style={{
                        padding: "10px 12px", textAlign: "left",
                        fontSize: "9px", letterSpacing: "0.12em",
                        color: "#52525b", fontFamily: "monospace", fontWeight: 600, whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.lineItems.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* # */}
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{ fontFamily: "monospace", color: "#52525b" }}>{idx + 1}</span>
                      </td>
                      {/* Item Type */}
                      <td style={{ padding: "10px 12px", minWidth: "130px" }}>
                        <select value={item.itemType} onChange={e => updateItem(item.id, "itemType", e.target.value)} style={tdSelectStyle}>
                          {(["Loose Stone","Studded Jewelry"] as ItemType[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Weight */}
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input type="number" value={item.weightValue} onChange={e => updateItem(item.id, "weightValue", e.target.value)} placeholder="0.00" style={{ ...tdInputStyle, flex: 1 }} />
                          <select value={item.weightUnit} onChange={e => updateItem(item.id, "weightUnit", e.target.value)} style={{ ...tdSelectStyle, width: "52px", padding: "6px 4px" }}>
                            <option value="ct">ct</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                      </td>
                      {/* Dimensions */}
                      <td style={{ padding: "10px 12px", minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <input type="number" value={item.length} onChange={e => updateItem(item.id, "length", e.target.value)} placeholder="L" style={{ ...tdInputStyle, width: "52px" }} />
                          <span style={{ color: "#3f3f46" }}>×</span>
                          <input type="number" value={item.width} onChange={e => updateItem(item.id, "width", e.target.value)} placeholder="W" style={{ ...tdInputStyle, width: "52px" }} />
                          <span style={{ color: "#3f3f46" }}>×</span>
                          <input type="number" value={item.depth} onChange={e => updateItem(item.id, "depth", e.target.value)} placeholder="D" style={{ ...tdInputStyle, width: "52px" }} />
                        </div>
                      </td>
                      {/* Shape */}
                      <td style={{ padding: "10px 12px", minWidth: "140px" }}>
                        <select value={item.shape} onChange={e => updateItem(item.id, "shape", e.target.value)} style={tdSelectStyle}>
                          {SHAPES.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Color */}
                      <td style={{ padding: "10px 12px", minWidth: "100px" }}>
                        <select value={item.colorGrade} onChange={e => updateItem(item.id, "colorGrade", e.target.value)} style={tdSelectStyle}>
                          {COLORS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Clarity */}
                      <td style={{ padding: "10px 12px", minWidth: "100px" }}>
                        <select value={item.clarityGrade} onChange={e => updateItem(item.id, "clarityGrade", e.target.value)} style={tdSelectStyle}>
                          {CLARITY.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Cut */}
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.cutGrade} onChange={e => updateItem(item.id, "cutGrade", e.target.value)} style={tdSelectStyle}>
                          {GRADES.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Polish */}
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.polish} onChange={e => updateItem(item.id, "polish", e.target.value)} style={tdSelectStyle}>
                          {(GRADES as PolishSymmetryGrade[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Symmetry */}
                      <td style={{ padding: "10px 12px", minWidth: "120px" }}>
                        <select value={item.symmetry} onChange={e => updateItem(item.id, "symmetry", e.target.value)} style={tdSelectStyle}>
                          {(GRADES as PolishSymmetryGrade[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      {/* Remarks */}
                      <td style={{ padding: "10px 12px", minWidth: "160px" }}>
                        <input value={item.remarks} onChange={e => updateItem(item.id, "remarks", e.target.value)} placeholder="Notes..." style={tdInputStyle} />
                      </td>
                      {/* Delete */}
                      <td style={{ padding: "10px 12px" }}>
                        <button onClick={() => removeItem(item.id)} title="Remove" style={{
                          background: "none", border: "none", color: "#52525b",
                          cursor: "pointer", fontSize: "14px", transition: "color 0.2s", padding: "2px 6px",
                        }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.color = "#f87171")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.color = "#52525b")}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {form.lineItems.length > 0 && (
            <div style={{
              padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.04)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <button onClick={addItem} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
                ＋ Add another line item
              </button>
              <span style={{ fontSize: "10px", color: "#3f3f46", fontFamily: "monospace" }}>
                {form.lineItems.length} item{form.lineItems.length !== 1 ? "s" : ""} · total synced to header
              </span>
            </div>
          )}
        </div>

        {/* ── BOTTOM ACTIONS ── */}
        <div className="anim-fade-up d3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", paddingBottom: "32px" }}>
          <Link href="/submissions" style={{ fontSize: "12px", color: "#71717a", textDecoration: "none" }}>← Back to Dashboard</Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.09)",
              color: "#71717a", fontSize: "12px", padding: "9px 18px",
              borderRadius: "8px", cursor: "pointer",
            }}>Print / Export PDF</button>
            <button onClick={save} style={{
              background: saved ? "#16a34a" : "#c9a84c",
              color: saved ? "#fff" : "#0f0900",
              fontWeight: 700, fontSize: "12px", border: "none",
              padding: "9px 24px", borderRadius: "8px", cursor: "pointer",
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