import type { CostRow } from "@/components/marketing/cost-summary";

/**
 * The itemised licence costs, ported verbatim from the original.
 *
 * Shared because each table appears twice: once on its own cost page and once
 * as the summary band on the matching how-to guide. The dash characters are
 * the original's own and are deliberately inconsistent — an en dash on some
 * rows, a hyphen on others.
 */
export const REAL_ESTATE_COST_ROWS: readonly CostRow[] = [
  { label: "1. Pre-Licensing Course", value: "$100 – $500" },
  { label: "2. Background Check", value: "$50 - $80" },
  { label: "3. Application", value: "$83.75" },
  { label: "4. State Examination", value: "$36.75" },
  { label: "Total Cost", value: "~$270 – $690", total: true },
];

export const REAL_ESTATE_COST_INTRO =
  "To obtain your real estate license in Florida in 2026, you should expect to spend between $270 and $690, covering the costs of the pre-licensing course, background check, application fee, and the state examination. The total cost varies significantly depending on the format of the pre-licensing course you choose (self-paced vs. classroom) and the complexity of your criminal background check.";

export const CAM_COST_ROWS: readonly CostRow[] = [
  { label: "1. Pre-License Course", value: "$180 – $340" },
  { label: "2. Background Check", value: "$50 – $80" },
  { label: "3. Application", value: "$205.50" },
  { label: "4. State Examination", value: "$49.50" },
  { label: "Total Cost", value: "~$485 – $675", total: true },
];

export const CAM_COST_INTRO =
  "To obtain your CAM license in Florida in 2026, you should expect to spend between $485 and $675, covering the costs of the pre-licensing course, background check, application fee, and the state examination. The total cost varies significantly depending on the format of the pre-licensing course you choose (self-paced vs. classroom) and the complexity of your criminal background check.";

/** The original's own calculator vector, on every cost band. */
export const COST_ARTWORK = { src: "/course/real-estate-calculator.svg" };
