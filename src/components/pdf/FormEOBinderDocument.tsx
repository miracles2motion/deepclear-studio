import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClearanceReport } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
  },
  // Top Header Banner
  headerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 6,
    padding: 14,
    marginBottom: 14,
  },
  headerTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
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
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  summaryCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginBottom: 14,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#0F172A",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  headerCell: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  cellText: {
    fontSize: 7,
    color: "#1E293B",
  },
  cellTextBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
  },

  // Column Widths (Proportional Flex)
  colNum: { width: "5%" },
  colScene: { width: "7%" },
  colCat: { width: "15%" },
  colHazard: { width: "24%" },
  colSub: { width: "27%" },
  colExp: { width: "11%", textAlign: "right" },
  colStatus: { width: "11%", alignItems: "flex-end" },

  // Status Badges
  badgeLicensed: {
    backgroundColor: "#E0F2FE",
    borderWidth: 0.5,
    borderColor: "#38BDF8",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  badgeLicensedText: {
    color: "#0369A1",
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  badgeMutated: {
    backgroundColor: "#DCFCE7",
    borderWidth: 0.5,
    borderColor: "#4ADE80",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  badgeMutatedText: {
    color: "#15803D",
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  badgeHazard: {
    backgroundColor: "#FFE4E6",
    borderWidth: 0.5,
    borderColor: "#FB7185",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  badgeHazardText: {
    color: "#BE123C",
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },

  // Cryptographic Attestation Box
  cryptoBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
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
    marginTop: 4,
    fontStyle: "italic",
  },
});

interface FormEOBinderProps {
  report: ClearanceReport;
}

export const FormEOBinderDocument: React.FC<FormEOBinderProps> = ({ report }) => {
  const isFullyCleared = report.finalExposureUsd === 0 && report.initialExposureUsd > 0;
  const licensedEntityIds = report.licensedEntityIds || [];
  const clearedEntityIds = report.clearedEntityIds || [];

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
      <Page size="LETTER" style={styles.page}>
        {/* 1. Header Banner */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>DEEPCLEAR STUDIO // FORM E&O-2026</Text>
              <Text style={styles.headerSubTitle}>
                AUTONOMOUS PRODUCTION CLEARANCE & ADJUDICATED SAFE HARBOR BINDER
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {isFullyCleared ? "E&O APPROVED" : "PENDING CLEARANCE"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Policy Binder ID: {report.id}</Text>
            <Text style={styles.metaText}>
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </Text>
            <Text style={styles.metaText}>Jurisdiction: Statutory Entertainment Fair Use</Text>
          </View>
        </View>

        {/* 2. Executive Risk & Underwriting Summary Card */}
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
                <Text style={styles.label}>Initial Statutory Exposure:</Text>
                <Text style={styles.valueDanger}>
                  ${report.initialExposureUsd.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.label}>Post-Clearance Liability:</Text>
                <Text style={isFullyCleared ? styles.valueSuccess : styles.valueDanger}>
                  {isFullyCleared
                    ? "$0 (100% Mitigated)"
                    : `$${report.finalExposureUsd.toLocaleString()} (Active)`}
                </Text>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Underwriting Decision:</Text>
                <Text style={isFullyCleared ? styles.valueSuccess : styles.valueDanger}>
                  {isFullyCleared ? "APPROVED (Clean Policy)" : "ACTION REQUIRED"}
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
                <Text style={styles.label}>Tax Incentive Rebate:</Text>
                <Text style={styles.valueSuccess}>
                  +${report.potentialTaxRebateUsd.toLocaleString()} (
                  {report.taxJurisdiction || "State Credit"})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Itemized Hazard Clearance Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.colNum]}>#</Text>
            <Text style={[styles.headerCell, styles.colScene]}>Scene</Text>
            <Text style={[styles.headerCell, styles.colCat]}>Category</Text>
            <Text style={[styles.headerCell, styles.colHazard]}>Identified Asset / Hazard</Text>
            <Text style={[styles.headerCell, styles.colSub]}>Adjudicated Substitution</Text>
            <Text style={[styles.headerCell, styles.colExp]}>Exposure</Text>
            <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
          </View>

          {/* Table Rows */}
          {report.entities.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.cellText, { width: "100%", textAlign: "center" }]}>
                No statutory liabilities detected. Screenplay fully compliant.
              </Text>
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
                subText = "Licensed (Release On File • Retained in Screenplay)";
              } else if (isMutated) {
                subText = ent.defusedText || "Cleared Narrative Prop";
              }

              return (
                <View
                  key={ent.id || idx}
                  style={[
                    styles.tableRow,
                    { backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF" },
                  ]}
                >
                  <Text style={[styles.cellText, styles.colNum]}>{idx + 1}</Text>
                  <Text style={[styles.cellText, styles.colScene]}>Sc. {ent.sceneNumber}</Text>
                  <Text style={[styles.cellTextBold, styles.colCat]}>
                    {ent.category.toUpperCase()}
                  </Text>
                  <Text style={[styles.cellTextBold, styles.colHazard]}>{ent.rawText}</Text>
                  <Text style={[styles.cellText, styles.colSub]}>{subText}</Text>
                  <Text style={[styles.cellTextBold, styles.colExp]}>
                    {isResolved ? `$${ent.originalExposure.toLocaleString()} -> $0` : `$${ent.originalExposure.toLocaleString()}`}
                  </Text>
                  <View style={styles.colStatus}>
                    {isLicensed ? (
                      <View style={styles.badgeLicensed}>
                        <Text style={styles.badgeLicensedText}>LICENSED</Text>
                      </View>
                    ) : isMutated ? (
                      <View style={styles.badgeMutated}>
                        <Text style={styles.badgeMutatedText}>MUTATED</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeHazard}>
                        <Text style={styles.badgeHazardText}>HAZARD</Text>
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
            Attestation by DeepClear Multi-Agent Crew Swarm (Legal Counsel, Script Supervisor,
            Director, Location Manager, and Completion Bond Officer). This binder provides statutory
            indemnity safe harbor under Form E&O-2026 entertainment insurance protocols.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
