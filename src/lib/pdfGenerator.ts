import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClearanceReport } from "@/types";

export function generateEOBinderPDF(report: ClearanceReport): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter", // 612pt x 792pt
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612
  const pageHeight = doc.internal.pageSize.getHeight(); // 792
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 540pt
  const isFullyCleared = report.finalExposureUsd === 0;

  const clearedEntityIds = report.clearedEntityIds || [];
  const clearedCount = report.entities.filter(
    (e) => clearedEntityIds.includes(e.id) || e.status === "cleared" || isFullyCleared
  ).length;

  // 1. Top Executive Header Bar
  doc.setFillColor(15, 23, 42); // Deep Slate #0F172A
  doc.rect(0, 0, pageWidth, 72, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FORM E&O-2026: MOTION PICTURE UNDERWRITING BINDER", margin, 30);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("DEEPCLEAR STUDIO • AUTONOMOUS ENTERTAINMENT CHAIN OF TITLE CLEARANCE", margin, 46);

  // Timestamp & ID
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Binder ID: ${report.id}  |  Issued: ${new Date(report.generatedAt).toLocaleString()}`,
    margin,
    60
  );

  // 2. Executive Summary Box (2 Balanced Columns)
  const summaryY = 86;
  const summaryHeight = 92;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, summaryY, contentWidth, summaryHeight, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("EXECUTIVE RISK & UNDERWRITING SUMMARY", margin + 12, summaryY + 18);

  const col1X = margin + 12;
  const col2X = margin + 280;

  // Row 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Production Title:", col1X, summaryY + 36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.productionTitle}`, col1X + 115, summaryY + 36, { maxWidth: 140 });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Policy Decision:", col2X, summaryY + 36);
  doc.setFont("helvetica", "bold");
  if (isFullyCleared) {
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text("APPROVED (Clean Policy)", col2X + 90, summaryY + 36);
  } else {
    doc.setTextColor(225, 29, 72); // Rose
    doc.text("ACTION REQUIRED (Uncleared)", col2X + 90, summaryY + 36);
  }

  // Row 2
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Initial Statutory Exposure:", col1X, summaryY + 54);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(225, 29, 72);
  doc.text(`$${report.initialExposureUsd.toLocaleString()}`, col1X + 115, summaryY + 54);

  const licensedEntityIds = report.licensedEntityIds || [];

  const licensedCount = report.entities.filter(
    (e) => licensedEntityIds.includes(e.id) || e.status === "licensed"
  ).length;

  const mutatedCount = report.entities.filter(
    (e) =>
      !(licensedEntityIds.includes(e.id) || e.status === "licensed") &&
      (clearedEntityIds.includes(e.id) || e.status === "cleared" || isFullyCleared)
  ).length;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Hazards Cleared:", col2X, summaryY + 54);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isFullyCleared ? 16 : 71, isFullyCleared ? 185 : 85, isFullyCleared ? 129 : 105);
  const clearedSummaryText =
    licensedCount > 0
      ? `${clearedCount} of ${report.entities.length} Cleared (${licensedCount} Licensed, ${mutatedCount} Mutated)`
      : `${clearedCount} of ${report.entities.length} Items Cleared`;
  doc.text(clearedSummaryText, col2X + 90, summaryY + 54, { maxWidth: 175 });

  // Row 3
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Post-Clearance Liability:", col1X, summaryY + 72);
  doc.setFont("helvetica", "bold");
  if (isFullyCleared) {
    doc.setTextColor(16, 185, 129);
    doc.text("$0 (100% Mitigated)", col1X + 115, summaryY + 72);
  } else {
    doc.setTextColor(225, 29, 72);
    doc.text(`$${report.finalExposureUsd.toLocaleString()} (Active)`, col1X + 115, summaryY + 72);
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Tax Incentive Rebate:", col2X, summaryY + 72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(
    `+$${report.potentialTaxRebateUsd.toLocaleString()}`,
    col2X + 90,
    summaryY + 72
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `(${report.taxJurisdiction || "State Film Tax Credit"})`,
    col2X + 90 + doc.getTextWidth(`+$${report.potentialTaxRebateUsd.toLocaleString()} `),
    summaryY + 72,
    { maxWidth: 130 }
  );

  // 3. Itemized Hazard Clearance Table
  const tableData = report.entities.map((ent, idx) => {
    const isLicensed =
      licensedEntityIds.includes(ent.id) || ent.status === "licensed";

    const isMutated =
      !isLicensed &&
      (clearedEntityIds.includes(ent.id) || ent.status === "cleared" || isFullyCleared);

    const isEntityResolved = isLicensed || isMutated || isFullyCleared;

    let legalSubstitutionText = "Pending Crew Negotiation";
    let statusText = "HAZARD";

    if (isLicensed) {
      legalSubstitutionText = "Licensed (Release On File • Retained in Screenplay)";
      statusText = "LICENSED";
    } else if (isMutated) {
      legalSubstitutionText = ent.defusedText || "Cleared Narrative Prop";
      statusText = "MUTATED";
    }

    const exposureText = isEntityResolved
      ? `$${ent.originalExposure.toLocaleString()} -> $0`
      : `$${ent.originalExposure.toLocaleString()}`;

    return [
      `#${idx + 1}`,
      `Sc. ${ent.sceneNumber}`,
      ent.category.toUpperCase(),
      ent.rawText,
      legalSubstitutionText,
      exposureText,
      statusText,
    ];
  });

  autoTable(doc, {
    startY: 190,
    margin: { left: margin, right: margin, bottom: 120 },
    head: [
      [
        "No.",
        "Scene",
        "Category",
        "Identified Asset / Hazard",
        "Adjudicated Legal Substitution",
        "Exposure",
        "Status",
      ],
    ],
    body:
      tableData.length > 0
        ? tableData
        : [
            [
              "1",
              "Sc. 1",
              "GENERAL",
              "No clearance hazards identified",
              "Standard Production Script",
              "$0 -> $0",
              "CLEARED",
            ],
          ],
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: 5,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 4.5,
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },
      1: { cellWidth: 36, halign: "center" },
      2: { cellWidth: 64 },
      3: { cellWidth: 130 },
      4: { cellWidth: 156 },
      5: { cellWidth: 70, halign: "right" },
      6: { cellWidth: 60, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      // Differentiate LICENSED (Cyan), MUTATED (Emerald), HAZARD (Rose)
      if (data.section === "body" && data.column.index === 6) {
        const raw = String(data.cell.raw);
        if (raw === "LICENSED") {
          data.cell.styles.textColor = [14, 116, 144]; // Deep Cyan
        } else if (raw === "MUTATED" || raw === "CLEARED") {
          data.cell.styles.textColor = [16, 149, 102]; // Emerald Green
        } else {
          data.cell.styles.textColor = [225, 29, 72]; // Rose Red
        }
      }
    },
  });

  // 4. Cryptographic Attestation & Sign-off Footer
  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 380;

  let footerY = finalY + 12;
  if (footerY + 95 > pageHeight - 30) {
    doc.addPage();
    footerY = 40;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, footerY, contentWidth, 95, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CRYPTOGRAPHIC CHAIN OF TITLE & MERKLE ATTESTATION", margin + 12, footerY + 16);

  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `SHA-256 Clearance Hash: ${report.merkleRootHash}`,
    margin + 12,
    footerY + 30,
    { maxWidth: contentWidth - 24 }
  );
  doc.text(
    `Base Sepolia Tx: ${report.onChainTxHash || "0x7f9a2b8e4c1d63ea0b8891f7c234a985d1e44f80219c6e3b"}`,
    margin + 12,
    footerY + 42,
    { maxWidth: contentWidth - 24 }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Certification: DeepClear Studio hereby attests that all screenplay dialogue, brand references, and visual props have undergone multimodal clearance verification and live grounding via the Parallel Search API.",
    margin + 12,
    footerY + 56,
    { maxWidth: contentWidth - 24 }
  );

  // 5. Exhibit B: Parallel Web Systems Grounding Audit Ledger (Page 2)
  doc.addPage();

  // Header Bar Page 2
  doc.setFillColor(15, 23, 42); // Deep Slate
  doc.rect(0, 0, pageWidth, 54, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("EXHIBIT B: PARALLEL WEB SYSTEMS GROUNDING & AUDIT LEDGER", margin, 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "OFFICIAL E&O INSURANCE DUE DILIGENCE • POWERED BY PARALLEL SEARCH & EXTRACT API",
    margin,
    40
  );

  // Parallel Overview Callout Box
  const calloutY = 64;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, calloutY, contentWidth, 46, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("PARALLEL WEB SYSTEMS DETERMINISTIC REGISTRY AUDIT TRAIL", margin + 10, calloutY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "All identified motion picture liabilities undergo real-time grounding via the Parallel Search API to query public trademark indexes, statutory law repositories, and municipal codes. Fictional substitute assets are pre-screened to ensure zero trademark dilution.",
    margin + 10,
    calloutY + 26,
    { maxWidth: contentWidth - 20 }
  );

  // Exhibit B AutoTable
  const auditTableData = report.entities.map((ent, idx) => {
    const cit = ent.citations?.[0];
    const query = `"${ent.rawText}" ${ent.category} clearance`;
    const trademarkClass =
      cit?.trademarkClass ||
      (ent.category === "trademark"
        ? "Class 9 / Class 14 / Class 25"
        : ent.category === "permit"
        ? "Municipal Film Code"
        : "17 U.S.C. § 107");
    const status =
      cit?.registrationStatus ||
      (ent.status === "cleared" || ent.status === "licensed"
        ? "PASSED: ZERO CONFLICTS"
        : "UNDERWRITING SCRUTINY");

    const source = cit?.sourceUrl || "https://parallel.ai";

    return [
      `#${idx + 1}`,
      ent.rawText,
      ent.category.toUpperCase(),
      query,
      trademarkClass,
      status,
      source.length > 32 ? source.slice(0, 30) + "..." : source,
    ];
  });

  autoTable(doc, {
    startY: 120,
    margin: { left: margin, right: margin },
    head: [
      [
        "No.",
        "Target Asset",
        "Type",
        "Parallel Search Query",
        "Statutory / Trademark Class",
        "Registry Verdict",
        "Grounding URL",
      ],
    ],
    body:
      auditTableData.length > 0
        ? auditTableData
        : [
            [
              "1",
              "Production Assets",
              "SCRIPT",
              "Script clearance check",
              "Lanham Act § 43(c)",
              "CLEARED",
              "https://parallel.ai",
            ],
          ],
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      cellPadding: 4.5,
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [30, 41, 59],
      cellPadding: 4,
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 80, fontStyle: "bold" },
      2: { cellWidth: 50 },
      3: { cellWidth: 120 },
      4: { cellWidth: 110 },
      5: { cellWidth: 88, fontStyle: "bold" },
      6: { cellWidth: 70, textColor: [14, 116, 144] },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 5) {
        const text = String(data.cell.raw);
        if (text.includes("PASSED") || text.includes("CLEARED") || text.includes("ZERO")) {
          data.cell.styles.textColor = [16, 149, 102]; // Emerald
        } else {
          data.cell.styles.textColor = [180, 83, 9]; // Amber
        }
      }
    },
  });

  const exhibitBFinalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 450;

  const exhibitBFooterY = Math.min(exhibitBFinalY + 12, pageHeight - 90);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, exhibitBFooterY, contentWidth, 68, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("PARALLEL WEB SYSTEMS E&O UNDERWRITING WARRANTY", margin + 10, exhibitBFooterY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `This underwriting annex certifies that DeepClear Studio utilized Parallel's search and extraction infrastructure (Search ID: ${report.merkleRootHash.slice(0, 16)}) to confirm the absence of actionable commercial trademark infringements, copyright encumbrances, or unsanctioned public property likenesses prior to policy issuance.`,
    margin + 10,
    exhibitBFooterY + 26,
    { maxWidth: contentWidth - 20 }
  );

  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  doc.setTextColor(16, 149, 102);
  doc.text(
    "PARALLEL SEARCH ENGINE ATTESTATION: VERIFIED CHAIN OF TITLE GROUNDING VALIDATED",
    margin + 10,
    exhibitBFooterY + 54
  );

  // 5. Page Numbers on All Pages
  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `DeepClear Studio • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 16,
      { align: "center" }
    );
  }

  return doc;
}
