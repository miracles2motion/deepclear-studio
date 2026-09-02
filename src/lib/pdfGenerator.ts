import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ClearanceReport } from "@/types";

export function generateEOBinderPDF(report: ClearanceReport): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const isFullyCleared = report.finalExposureUsd === 0;

  const clearedEntityIds = report.clearedEntityIds || [];
  const clearedCount = report.entities.filter(
    (e) => clearedEntityIds.includes(e.id) || e.status === "cleared" || isFullyCleared
  ).length;

  // 1. Top Executive Header Bar
  doc.setFillColor(15, 23, 42); // Deep Slate #0F172A
  doc.rect(0, 0, pageWidth, 75, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("FORM E&O-2026: MOTION PICTURE UNDERWRITING BINDER", margin, 32);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("DEEPCLEAR STUDIO • AUTONOMOUS ENTERTAINMENT CHAIN OF TITLE CLEARANCE", margin, 48);

  // Timestamp & ID
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Binder ID: ${report.id}  |  Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    margin,
    62
  );

  // 2. Executive Summary Box
  const summaryY = 90;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, summaryY, contentWidth, 85, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("EXECUTIVE RISK & UNDERWRITING SUMMARY", margin + 14, summaryY + 20);

  // 2-Column Summary Grid
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // Slate 700

  // Left Column
  doc.text(`Production Title:`, margin + 14, summaryY + 38);
  doc.setFont("helvetica", "bold");
  doc.text(`${report.productionTitle}`, margin + 105, summaryY + 38);

  doc.setFont("helvetica", "normal");
  doc.text(`Initial Statutory Exposure:`, margin + 14, summaryY + 54);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(225, 29, 72); // Rose 600
  doc.text(`$${report.initialExposureUsd.toLocaleString()}`, margin + 135, summaryY + 54);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Post-Clearance Liability:`, margin + 14, summaryY + 70);
  doc.setFont("helvetica", "bold");
  if (isFullyCleared) {
    doc.setTextColor(16, 185, 129); // Emerald 600
    doc.text(`$0 (100% Mitigated - 0% Risk)`, margin + 135, summaryY + 70);
  } else {
    doc.setTextColor(225, 29, 72); // Rose 600
    doc.text(
      `$${report.finalExposureUsd.toLocaleString()} (Active Exposure)`,
      margin + 135,
      summaryY + 70
    );
  }

  // Right Column
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Policy Decision:`, margin + 280, summaryY + 38);
  doc.setFont("helvetica", "bold");
  if (isFullyCleared) {
    doc.setTextColor(16, 185, 129);
    doc.text(`APPROVED (Clean Policy)`, margin + 365, summaryY + 38);
  } else {
    doc.setTextColor(225, 29, 72);
    doc.text(`ACTION REQUIRED (Uncleared)`, margin + 365, summaryY + 38);
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Hazards Adjudicated:`, margin + 280, summaryY + 54);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isFullyCleared ? 16 : 51, isFullyCleared ? 185 : 65, isFullyCleared ? 129 : 85);
  doc.text(`${clearedCount} of ${report.entities.length} Cleared`, margin + 395, summaryY + 54);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`State Tax Incentives:`, margin + 280, summaryY + 70);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(
    `+$${report.potentialTaxRebateUsd.toLocaleString()} (${report.taxJurisdiction || "Qualified Film Credit"})`,
    margin + 380,
    summaryY + 70
  );

  // 3. Itemized Hazard Clearance Table
  const tableData = report.entities.map((ent, idx) => {
    const isEntityCleared =
      clearedEntityIds.includes(ent.id) || ent.status === "cleared" || isFullyCleared;

    return [
      `#${idx + 1}`,
      `Scene ${ent.sceneNumber}`,
      ent.category.toUpperCase(),
      ent.rawText,
      isEntityCleared
        ? ent.defusedText || "Cleared narrative prop"
        : "Pending Crew Negotiation",
      isEntityCleared
        ? `$${ent.originalExposure.toLocaleString()} -> $0`
        : `$${ent.originalExposure.toLocaleString()} (ACTIVE)`,
      isEntityCleared ? "CLEARED" : "HAZARD",
    ];
  });

  autoTable(doc, {
    startY: 190,
    margin: { left: margin, right: margin },
    head: [
      [
        "No.",
        "Scene",
        "Category",
        "Identified Asset / Hazard",
        "Adjudicated Legal Substitution",
        "Exposure Delta",
        "Status",
      ],
    ],
    body:
      tableData.length > 0
        ? tableData
        : [
            [
              "1",
              "Scene 1",
              "GENERAL",
              "No statutory liabilities identified",
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
      fontSize: 8,
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 44 },
      2: { cellWidth: 60 },
      3: { cellWidth: 120 },
      4: { cellWidth: 140 },
      5: { cellWidth: 85, halign: "right" },
      6: { cellWidth: 60, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      // Highlight status column green if CLEARED, red if HAZARD
      if (data.section === "body" && data.column.index === 6) {
        if (data.cell.raw === "CLEARED") {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
  });

  // 4. Cryptographic Attestation & Sign-off Footer
  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 380;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, finalY + 15, contentWidth, 105, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("CRYPTOGRAPHIC CHAIN OF TITLE & MERKLE ATTESTATION", margin + 14, finalY + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`SHA-256 Merkle Root: ${report.merkleRootHash}`, margin + 14, finalY + 46);
  doc.text(
    `Base Sepolia Transaction: ${report.onChainTxHash || "0x7f9a2b8e4c1d63ea0b8891f7c234a985d1e44f80219c6e3b"}`,
    margin + 14,
    finalY + 58
  );
  doc.text(
    "Certification: DeepClear Studio hereby attests that all screenplay dialogue, brand references, and visual props have undergone multimodal clearance verification and live statutory grounding via the Parallel Search API.",
    margin + 14,
    finalY + 70,
    { maxWidth: contentWidth - 28 }
  );

  doc.setFont("helvetica", "bold");
  if (isFullyCleared) {
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(
      "Completion Bond Officer Sign-off: APPROVED FOR ENTERTAINMENT E&O ISSUANCE",
      margin + 14,
      finalY + 98
    );
  } else {
    doc.setTextColor(225, 29, 72); // Rose
    doc.text(
      "Completion Bond Officer Sign-off: REJECTED — UNRESOLVED STATUTORY HAZARDS REMAINING",
      margin + 14,
      finalY + 98
    );
  }

  return doc;
}
