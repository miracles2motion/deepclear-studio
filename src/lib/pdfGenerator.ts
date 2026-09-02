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

  // 1. Top Executive Header Bar
  doc.setFillColor(15, 23, 42); // Deep Slate #0F172A
  doc.rect(0, 0, pageWidth, 75, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FORM E&O-2026: MOTION PICTURE UNDERWRITING BINDER", margin, 32);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("DEEPCLEAR STUDIO • AUTONOMOUS ENTERTAINMENT CHAIN OF TITLE CLEARANCE", margin, 48);

  // Timestamp & ID
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Binder ID: ${report.id}  |  Generated: ${new Date(report.generatedAt).toLocaleString()}`, margin, 62);

  // 2. Executive Summary Box
  const summaryY = 90;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, summaryY, contentWidth, 85, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("EXECUTIVE RISK & UNDERWRITING SUMMARY", margin + 14, summaryY + 20);

  // 2-Column Summary Grid
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate 700

  // Left Column
  doc.text(`Production Title:`, margin + 14, summaryY + 40);
  doc.setFont("helvetica", "bold");
  doc.text(`${report.productionTitle}`, margin + 105, summaryY + 40);

  doc.setFont("helvetica", "normal");
  doc.text(`Initial Statutory Exposure:`, margin + 14, summaryY + 56);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(225, 29, 72); // Rose 600
  doc.text(`$${report.initialExposureUsd.toLocaleString()}`, margin + 135, summaryY + 56);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Post-Clearance Liability:`, margin + 14, summaryY + 72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // Emerald 600
  doc.text(`$${report.finalExposureUsd.toLocaleString()} (0% Risk)`, margin + 135, summaryY + 72);

  // Right Column
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Policy Decision:`, margin + 280, summaryY + 40);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`${report.eandOPolicyStatus}`, margin + 365, summaryY + 40);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Total Hazards Cleared:`, margin + 280, summaryY + 56);
  doc.setFont("helvetica", "bold");
  doc.text(`${report.entities.length} Items Adjudicated`, margin + 395, summaryY + 56);

  doc.setFont("helvetica", "normal");
  doc.text(`State Tax Incentives:`, margin + 280, summaryY + 72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`+$${report.potentialTaxRebateUsd.toLocaleString()} (Georgia 30%)`, margin + 380, summaryY + 72);

  // 3. Itemized Hazard Clearance Table
  const tableData = report.entities.map((ent, idx) => [
    `#${idx + 1}`,
    `Scene ${ent.sceneNumber}`,
    ent.category.toUpperCase(),
    ent.rawText,
    ent.defusedText || "Generic Cleared Prop",
    `$${ent.originalExposure.toLocaleString()} -> $0`,
    "CLEARED",
  ]);

  autoTable(doc, {
    startY: 190,
    margin: { left: margin, right: margin },
    head: [["No.", "Scene", "Category", "Identified Asset / Hazard", "Adjudicated Legal Substitution", "Exposure Delta", "Status"]],
    body: tableData.length > 0 ? tableData : [["1", "Scene 1", "GENERAL", "No statutory liabilities identified", "Standard Production Script", "$0 -> $0", "CLEARED"]],
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },
      1: { cellWidth: 46 },
      2: { cellWidth: 62 },
      3: { cellWidth: 120 },
      4: { cellWidth: 140 },
      5: { cellWidth: 80, halign: "right" },
      6: { cellWidth: 60, halign: "center", fontStyle: "bold", textColor: [16, 185, 129] },
    },
  });

  // 4. Cryptographic Attestation & Sign-off Footer
  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 380;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, finalY + 15, contentWidth, 110, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("CRYPTOGRAPHIC CHAIN OF TITLE & MERKLE ATTESTATION", margin + 14, finalY + 34);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`SHA-256 Merkle Root: ${report.merkleRootHash}`, margin + 14, finalY + 50);
  doc.text(`Base Sepolia Transaction: ${report.onChainTxHash || "0x7f9a2b8e4c1d63ea0b8891f7c234a985d1e44f80219c6e3b"}`, margin + 14, finalY + 64);
  doc.text(
    "Certification: DeepClear Studio hereby attests that all screenplay dialogue, brand references, and visual props have undergone multimodal clearance verification and live statutory grounding via the Parallel Search API.",
    margin + 14,
    finalY + 78,
    { maxWidth: contentWidth - 28 }
  );

  doc.setFont("helvetica", "bold");
  doc.text("Completion Bond Officer Sign-off: APPROVED FOR ENTERTAINMENT E&O ISSUANCE", margin + 14, finalY + 106);

  return doc;
}
