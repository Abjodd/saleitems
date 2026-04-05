// types.ts — Shared types for Gem Lab Job Card System

export type ServiceType =
  | "Diamond Grading"
  | "Colored Stone Analysis"
  | "Jewelry Appraisal"
  | "Pearl Certification"
  | "Synthetic Detection";

export type TAT = "Normal" | "Express" | "Same-day";

export type LogisticsMethod = "In-person Pickup" | "Insured Courier";

export type SubmissionStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "On Hold"
  | "Dispatched";

export type ItemType = "Loose Stone" | "Studded Jewelry";

export type Shape =
  | "Round Brilliant"
  | "Princess"
  | "Cushion"
  | "Oval"
  | "Pear"
  | "Emerald"
  | "Heart"
  | "Marquise"
  | "Radiant"
  | "Asscher"
  | "Other";

export type ColorGrade =
  | "D" | "E" | "F" | "G" | "H" | "I" | "J"
  | "K" | "L" | "M" | "N" | "O-P" | "Q-R"
  | "S-T" | "U-V" | "W-X" | "Y-Z"
  | "Fancy Yellow" | "Fancy Pink" | "Fancy Blue"
  | "Fancy Green" | "Fancy Red" | "Fancy Orange"
  | "Fancy Brown" | "N/A";

export type ClarityGrade =
  | "FL" | "IF" | "VVS1" | "VVS2"
  | "VS1" | "VS2" | "SI1" | "SI2"
  | "I1" | "I2" | "I3" | "N/A";

export type CutGrade = "Excellent" | "Very Good" | "Good" | "Fair" | "Poor" | "N/A";

export type PolishSymmetryGrade = "Excellent" | "Very Good" | "Good" | "Fair" | "Poor" | "N/A";

export interface LineItem {
  id: string;
  itemType: ItemType;
  weightValue: string;
  weightUnit: "ct" | "g";
  length: string;
  width: string;
  depth: string;
  shape: Shape;
  colorGrade: ColorGrade;
  clarityGrade: ClarityGrade;
  cutGrade: CutGrade;
  polish: PolishSymmetryGrade;
  symmetry: PolishSymmetryGrade;
  remarks: string;
}

export interface Submission {
  id: string;
  referenceId: string;
  clientName: string;
  membershipId: string;
  gstNumber: string;
  submittedAt: string; // ISO string
  serviceType: ServiceType;
  tat: TAT;
  logistics: LogisticsMethod;
  status: SubmissionStatus;
  totalItems: number;
  lineItems: LineItem[];
}