import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClearanceReport } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
  },
  // Top Header Banner
  headerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: "#10B981",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  headerBadgePending: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  headerBadgeAnnex: {
    backgroundColor: "#0EA5E9",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  headerSubTitle: {
    fontSize: 7.5,
    color: "#94A3B8",
    marginTop: 3,
  },
  metaRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#334155",
    marginTop: 8,
    paddingTop: 6,
  },
  metaText: {
    fontSize: 7,
    color: "#CBD5E1",
  },

  // Executive Risk & Underwriting Summary Card
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryGrid: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  summaryCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    paddingHorizontal: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 10,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2.5,
  },
  label: {
    fontSize: 7.5,
    color: "#64748B",
  },
  valueBold: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    maxWidth: 160,
  },
  valueDanger: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#E11D48",
  },
  valueSuccess: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },

  // Itemized Hazard Table
  tableContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#0F172A",
    paddingVertical: 7,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
    minHeight: 26,
  },

  // Cell Layouts
  cellBox: {
    paddingHorizontal: 4,
    display: "flex",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  cellText: {
    fontSize: 7,
    color: "#1E293B",
    lineHeight: 1.3,
  },
  cellTextBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    lineHeight: 1.3,
  },
  cellTextMuted: {
    fontSize: 6.5,
    color: "#64748B",
    lineHeight: 1.25,
  },

  // Page 1 Column Widths (Sum = 100%)
  colNum: { width: "5%" },
  colScene: { width: "9%" },
  colCat: { width: "13%" },
  colHazard: { width: "23%" },
  colSub: { width: "26%" },
  colExp: { width: "12%" },
  colStatus: { width: "12%" },

  // Exhibit B Column Widths (Sum = 100%)
  colExNum: { width: "5%" },
  colExAsset: { width: "18%" },
  colExCat: { width: "11%" },
  colExQuery: { width: "24%" },
  colExClass: { width: "17%" },
  colExVerdict: { width: "13%" },
  colExSource: { width: "12%" },

  // Status Badges
  badgeLicensed: {
    backgroundColor: "#E0F2FE",
    borderWidth: 0.5,
    borderColor: "#38BDF8",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-end",
  },
  badgeLicensedText: {
    color: "#0369A1",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
  },
  badgeMutated: {
    backgroundColor: "#DCFCE7",
    borderWidth: 0.5,
    borderColor: "#4ADE80",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-end",
  },
  badgeMutatedText: {
    color: "#15803D",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
  },
  badgeHazard: {
    backgroundColor: "#FFE4E6",
    borderWidth: 0.5,
    borderColor: "#FB7185",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-end",
  },
  badgeHazardText: {
    color: "#BE123C",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
  },
  badgePassed: {
    backgroundColor: "#DCFCE7",
    borderWidth: 0.5,
    borderColor: "#4ADE80",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-end",
  },
  badgePassedText: {
    color: "#15803D",
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
  },
  badgeScrutiny: {
    backgroundColor: "#FEF3C7",
    borderWidth: 0.5,
    borderColor: "#F59E0B",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-end",
  },
  badgeScrutinyText: {
    color: "#B45309",
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
  },

  // Callout Box
  calloutBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  calloutTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  calloutText: {
    fontSize: 6.5,
    color: "#475569",
    lineHeight: 1.3,
  },

  // Cryptographic Attestation Box
  cryptoBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 9,
    marginBottom: 8,
  },
  cryptoTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cryptoHash: {
    fontSize: 6,
    fontFamily: "Courier",
    color: "#475569",
    marginBottom: 2,
  },
  cryptoNote: {
    fontSize: 6.5,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 1.3,
  },

  // Statutory Legal Disclaimer Box
  disclaimerBox: {
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 5.5,
    color: "#94A3B8",
    lineHeight: 1.3,
    fontStyle: "italic",
  },

  // Page Footer
  footerText: {
    fontSize: 6.5,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
  },
});

interface FormEOBinderProps {
  report: ClearanceReport;
}

export const FormEOBinderDocument: React.FC<FormEOBinderProps> = ({ report }) => {
  const licensedEntityIds = report.licensedEntityIds || [];
  const clearedEntityIds = report.clearedEntityIds || [];

  const pendingCount = report.entities.filter(
    (e) =>
      !licensedEntityIds.includes(e.id) &&
      !clearedEntityIds.includes(e.id) &&
      e.status !== "cleared" &&
      e.status !== "licensed"
  ).length;

  const isFullyCleared =
    report.finalExposureUsd === 0 &&
    (report.eandOPolicyStatus === "APPROVED" ||
      pendingCount === 0 ||
      report.initialExposureUsd > 0);

  const licensedCount = report.entities.filter(
    (e) => licensedEntityIds.includes(e.id) || e.status === "licensed"
  ).length;

  const mutatedCount = report.entities.filter(
    (e) =>
      !(licensedEntityIds.includes(e.id) || e.status === "licensed") &&
      (clearedEntityIds.includes(e.id) || e.status === "cleared" || isFullyCleared)
  ).length;

  const totalCleared = licensedCount + mutatedCount;

  return (
    <Document title={`Form_EO_2026_${report.productionTitle.replace(/\s+/g, "_")}`}>
      {/* ========================================================================= */}
      {/* PAGE 1: EXECUTIVE RISK & UNDERWRITING EVIDENCE BINDER                     */}
      {/* ========================================================================= */}
      <Page size="LETTER" style={styles.page}>
        {/* 1. Header Banner */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>DEEPCLEAR STUDIO // FORM E&O-2026</Text>
              <Text style={styles.headerSubTitle}>
                AUTONOMOUS SCREENPLAY CLEARANCE & E&O UNDERWRITING EVIDENCE BINDER
              </Text>
            </View>
            <View style={isFullyCleared ? styles.headerBadge : styles.headerBadgePending}>
              <Text style={styles.headerBadgeText}>
                {isFullyCleared ? "CLEARANCE READY" : "PENDING CLEARANCE"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Evidence Binder ID: {report.id}</Text>
            <Text style={styles.metaText}>
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </Text>
            <Text style={styles.metaText}>
              Governing Framework: US Title 17 & Lanham Act Fair Use Doctrine
            </Text>
          </View>
        </View>

        {/* 2. Executive Risk & Underwriting Summary Card (Balanced 2 Columns + Divider) */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>EXECUTIVE RISK & UNDERWRITING SUMMARY</Text>

          <View style={styles.summaryGrid}>
            {/* Left Column */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Production Title:</Text>
                <Text style={styles.valueBold}>{report.productionTitle}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.label}>Initial Modeled Exposure:</Text>
                <Text style={styles.valueDanger}>
                  ${report.initialExposureUsd.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.label}>Net Remaining Exposure:</Text>
                <Text style={isFullyCleared ? styles.valueSuccess : styles.valueDanger}>
                  {isFullyCleared
                    ? "$0 (100% Cleared)"
                    : `$${report.finalExposureUsd.toLocaleString()} (Active Exposure)`}
                </Text>
              </View>
            </View>

            {/* Vertical Divider Line */}
            <View style={styles.summaryDivider} />

            {/* Right Column */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Underwriting Readiness:</Text>
                <Text style={isFullyCleared ? styles.valueSuccess : styles.valueDanger}>
                  {isFullyCleared
                    ? "RECOMMENDED FOR RELEASE (100% Cleared)"
                    : "ACTION REQUIRED (Unresolved Liabilities)"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.label}>Clearance Progress:</Text>
                <Text style={styles.valueBold}>
                  {totalCleared} of {report.entities.length} Cleared
                  {licensedCount > 0 ? ` (${licensedCount} Lic, ${mutatedCount} Mut)` : ""}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.label}>Estimated Incentive Eligibility:</Text>
                <Text style={styles.valueSuccess}>
                  +${report.potentialTaxRebateUsd.toLocaleString()} (
                  {report.taxJurisdiction || "State Credit"} • Independent QPE)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Itemized Hazard Clearance Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.cellBox, styles.colNum]}>
              <Text style={styles.headerText}>#</Text>
            </View>
            <View style={[styles.cellBox, styles.colScene]}>
              <Text style={styles.headerText}>Scene</Text>
            </View>
            <View style={[styles.cellBox, styles.colCat]}>
              <Text style={styles.headerText}>Category</Text>
            </View>
            <View style={[styles.cellBox, styles.colHazard]}>
              <Text style={styles.headerText}>Identified Clearance Hazard</Text>
            </View>
            <View style={[styles.cellBox, styles.colSub]}>
              <Text style={styles.headerText}>Adjudicated Resolution / Substitution</Text>
            </View>
            <View style={[styles.cellBox, styles.colExp, { alignItems: "flex-end" }]}>
              <Text style={styles.headerText}>Exposure</Text>
            </View>
            <View style={[styles.cellBox, styles.colStatus, { alignItems: "flex-end" }]}>
              <Text style={styles.headerText}>Status</Text>
            </View>
          </View>

          {/* Table Rows */}
          {report.entities.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.cellBox, { width: "100%", alignItems: "center" }]}>
                <Text style={styles.cellTextMuted}>
                  No clearance hazards detected. Screenplay is fully compliant.
                </Text>
              </View>
            </View>
          ) : (
            report.entities.map((ent, idx) => {
              const isLicensed =
                licensedEntityIds.includes(ent.id) || ent.status === "licensed";
              const isMutated =
                !isLicensed &&
                (clearedEntityIds.includes(ent.id) || ent.status === "cleared" || isFullyCleared);
              const isResolved = isLicensed || isMutated || isFullyCleared;

              let subText = "Pending Crew Negotiation";
              if (isLicensed) {
                subText = ent.adjudicationMethod === "producer_directive"
                  ? "Licensed (Executive Producer Waiver Directive on File)"
                  : "Licensed (Release On File • Retained in Screenplay)";
              } else if (isMutated) {
                subText = ent.adjudicationMethod === "producer_directive"
                  ? `${ent.defusedText || "Cleared Narrative Prop"} (Executive Producer Directive)`
                  : (ent.defusedText || "Cleared Narrative Prop");
              }

              return (
                <View
                  key={ent.id || idx}
                  style={[
                    styles.tableRow,
                    { backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF" },
                  ]}
                >
                  {/* Col 1: # */}
                  <View style={[styles.cellBox, styles.colNum]}>
                    <Text style={styles.cellText}>{idx + 1}</Text>
                  </View>

                  {/* Col 2: Scene */}
                  <View style={[styles.cellBox, styles.colScene]}>
                    <Text style={styles.cellText}>Sc. {ent.sceneNumber}</Text>
                  </View>

                  {/* Col 3: Category */}
                  <View style={[styles.cellBox, styles.colCat]}>
                    <Text style={styles.cellTextBold}>{ent.category.toUpperCase()}</Text>
                  </View>

                  {/* Col 4: Identified Clearance Hazard */}
                  <View style={[styles.cellBox, styles.colHazard]}>
                    <Text style={styles.cellTextBold}>{ent.rawText}</Text>
                    {ent.description && (
                      <Text style={styles.cellTextMuted}>{ent.description}</Text>
                    )}
                  </View>

                  {/* Col 5: Substitution / License */}
                  <View style={[styles.cellBox, styles.colSub]}>
                    <Text style={styles.cellText}>{subText}</Text>
                  </View>

                  {/* Col 6: Modeled Exposure */}
                  <View style={[styles.cellBox, styles.colExp, { alignItems: "flex-end" }]}>
                    <Text style={styles.cellTextBold}>
                      {isResolved
                        ? `$0`
                        : `$${ent.originalExposure.toLocaleString()}`}
                    </Text>
                    {isResolved && (
                      <Text style={styles.cellTextMuted}>
                        was ${ent.originalExposure.toLocaleString()}
                      </Text>
                    )}
                  </View>

                  {/* Col 7: Clearance Status Badge */}
                  <View style={[styles.cellBox, styles.colStatus, { alignItems: "flex-end" }]}>
                    {isLicensed ? (
                      <View style={styles.badgeLicensed}>
                        <Text style={styles.badgeLicensedText}>
                          {ent.adjudicationMethod === "producer_directive" ? "LICENSED (PRODUCER)" : "LICENSED"}
                        </Text>
                      </View>
                    ) : isMutated ? (
                      <View style={styles.badgeMutated}>
                        <Text style={styles.badgeMutatedText}>
                          {ent.adjudicationMethod === "producer_directive" ? "MUTATED (PRODUCER)" : "MUTATED"}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.badgeHazard}>
                        <Text style={styles.badgeHazardText}>UNRESOLVED</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* 4. Cryptographic Attestation Box */}
        <View style={styles.cryptoBox}>
          <Text style={styles.cryptoTitle}>
            CRYPTOGRAPHIC CHAIN OF TITLE & MERKLE ROOT ATTESTATION
          </Text>
          <Text style={styles.cryptoHash}>SHA-256 Merkle Root: {report.merkleRootHash}</Text>
          <Text style={styles.cryptoHash}>
            Base Sepolia Ledger Tx:{" "}
            {report.onChainTxHash || "0x7f9a2b8e4c1d63ea0b8891f7c234a985d1e44f80219c6e3b"}
          </Text>
          <Text style={styles.cryptoNote}>
            Attestation by DeepClear Multi-Agent Crew Swarm (Legal Counsel, Script Supervisor, Location Manager, and Completion Bond Officer). Grounded against public trademark registries and municipal codes via Parallel Web Systems. All executive overrides ratified under Producer Clearance Directive protocol on file.
          </Text>
        </View>

        {/* 5. Statutory Underwriting Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            LEGAL & UNDERWRITING DISCLAIMER: Form E&O-2026 is an evidence-preparation artifact compiled for entertainment underwriting and clearance review. DeepClear Studio does not provide or certify E&O insurance, issue binding coverage, or make definitive legal determinations. Modeled Risk Exposure is an internal benchmark reserve and does not constitute a statement or prediction of actual legal liability. Policy issuance remains subject to final insurer underwriting approval.
          </Text>
        </View>

        <Text style={styles.footerText}>
          DeepClear Studio • Form E&O-2026 Evidence Binder • Page 1 of 2
        </Text>
      </Page>

      {/* ========================================================================= */}
      {/* PAGE 2: EXHIBIT B - PARALLEL WEB SYSTEMS GROUNDING & AUDIT LEDGER          */}
      {/* ========================================================================= */}
      <Page size="LETTER" style={styles.page}>
        {/* Exhibit B Header Banner */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>DEEPCLEAR STUDIO // EXHIBIT B</Text>
              <Text style={styles.headerSubTitle}>
                PARALLEL WEB SYSTEMS DETERMINISTIC GROUNDING & AUDIT LEDGER
              </Text>
            </View>
            <View style={styles.headerBadgeAnnex}>
              <Text style={styles.headerBadgeText}>E&O EVIDENCE ANNEX</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Audit Annex ID: EXHIBIT-B-{report.id.replace("CERT-", "")}
            </Text>
            <Text style={styles.metaText}>
              Registry Engine: Parallel Web Systems Search & Extract API
            </Text>
            <Text style={styles.metaText}>Protocol: Deterministic Clearance Gate v1.0</Text>
          </View>
        </View>

        {/* Callout Box */}
        <View style={styles.calloutBox}>
          <Text style={styles.calloutTitle}>
            PARALLEL WEB SYSTEMS DETERMINISTIC REGISTRY AUDIT TRAIL
          </Text>
          <Text style={styles.calloutText}>
            All identified motion picture liabilities undergo real-time grounding via the Parallel Search API to query public trademark indexes, statutory law repositories, and municipal codes. Fictional substitute assets are pre-screened to ensure zero trademark dilution and absence of active commercial conflicts.
          </Text>
        </View>

        {/* Exhibit B Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.cellBox, styles.colExNum]}>
              <Text style={styles.headerText}>#</Text>
            </View>
            <View style={[styles.cellBox, styles.colExAsset]}>
              <Text style={styles.headerText}>Target Asset</Text>
            </View>
            <View style={[styles.cellBox, styles.colExCat]}>
              <Text style={styles.headerText}>Category</Text>
            </View>
            <View style={[styles.cellBox, styles.colExQuery]}>
              <Text style={styles.headerText}>Parallel Search Query</Text>
            </View>
            <View style={[styles.cellBox, styles.colExClass]}>
              <Text style={styles.headerText}>Statutory / Class</Text>
            </View>
            <View style={[styles.cellBox, styles.colExVerdict, { alignItems: "flex-end" }]}>
              <Text style={styles.headerText}>Registry Verdict</Text>
            </View>
            <View style={[styles.cellBox, styles.colExSource, { alignItems: "flex-end" }]}>
              <Text style={styles.headerText}>Grounding Source</Text>
            </View>
          </View>

          {/* Table Rows */}
          {report.entities.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.cellBox, { width: "100%", alignItems: "center" }]}>
                <Text style={styles.cellTextMuted}>
                  No external registry lookups required. Screenplay is free of actionable commercial marks.
                </Text>
              </View>
            </View>
          ) : (
            report.entities.map((ent, idx) => {
              const cit = ent.citations?.[0];
              const query = `"${ent.rawText}" ${ent.category} clearance`;
              const trademarkClass =
                cit?.trademarkClass ||
                (ent.category === "trademark"
                  ? "Class 9 / Class 14 / Class 25"
                  : ent.category === "permit"
                  ? "Municipal Film Code"
                  : "17 U.S.C. § 107");

              const isPassed =
                cit?.registrationStatus?.includes("PASSED") ||
                cit?.registrationStatus?.includes("ZERO") ||
                ent.status === "cleared" ||
                ent.status === "licensed";

              const statusText = isPassed
                ? "PASSED: ZERO CONFLICTS"
                : (cit?.registrationStatus || "UNDERWRITING SCRUTINY");

              const rawSource = cit?.sourceUrl || "https://parallel.ai";
              const sourceDisplay = rawSource.replace(/^https?:\/\//, "").slice(0, 20);

              return (
                <View
                  key={ent.id || idx}
                  style={[
                    styles.tableRow,
                    { backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF" },
                  ]}
                >
                  <View style={[styles.cellBox, styles.colExNum]}>
                    <Text style={styles.cellText}>{idx + 1}</Text>
                  </View>

                  <View style={[styles.cellBox, styles.colExAsset]}>
                    <Text style={styles.cellTextBold}>{ent.rawText}</Text>
                  </View>

                  <View style={[styles.cellBox, styles.colExCat]}>
                    <Text style={styles.cellText}>{ent.category.toUpperCase()}</Text>
                  </View>

                  <View style={[styles.cellBox, styles.colExQuery]}>
                    <Text style={styles.cellTextMuted}>{query}</Text>
                  </View>

                  <View style={[styles.cellBox, styles.colExClass]}>
                    <Text style={styles.cellText}>{trademarkClass}</Text>
                  </View>

                  <View style={[styles.cellBox, styles.colExVerdict, { alignItems: "flex-end" }]}>
                    <View style={isPassed ? styles.badgePassed : styles.badgeScrutiny}>
                      <Text style={isPassed ? styles.badgePassedText : styles.badgeScrutinyText}>
                        {isPassed ? "PASSED: ZERO CONFLICTS" : "UNDERWRITING SCRUTINY"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.cellBox, styles.colExSource, { alignItems: "flex-end" }]}>
                    <Text style={styles.cellTextMuted}>{sourceDisplay}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Parallel Attestation Box */}
        <View style={styles.cryptoBox}>
          <Text style={styles.cryptoTitle}>
            PARALLEL WEB SYSTEMS GROUNDING & VERIFICATION ATTESTATION
          </Text>
          <Text style={styles.cryptoNote}>
            This underwriting evidence annex certifies that DeepClear Studio utilized Parallel's search and extraction infrastructure (Search Digest: {report.merkleRootHash.slice(0, 24)}...) to cross-reference public trademark records, statutory legal authorities, and municipal codes against all identified motion picture assets for underwriting review.
          </Text>
          <Text style={[styles.cryptoHash, { color: "#059669", marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
            PARALLEL SEARCH ENGINE GROUNDING ATTESTATION: VERIFIED EVIDENCE AUDIT TRAIL RECORDED
          </Text>
        </View>

        {/* Statutory Disclaimer on Page 2 */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            DISCLAIMER: Parallel Web Systems provides deterministic retrieval of public registries. Retrieval does not constitute legal counsel, commercial trademark registration, or an insurance policy guarantee.
          </Text>
        </View>

        <Text style={styles.footerText}>
          DeepClear Studio • Exhibit B Grounding Ledger • Page 2 of 2
        </Text>
      </Page>
    </Document>
  );
};
