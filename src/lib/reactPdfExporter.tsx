import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ClearanceReport } from "@/types";
import { FormEOBinderDocument } from "@/components/pdf/FormEOBinderDocument";
import { generateEOBinderPDF } from "@/lib/pdfGenerator";

/**
 * Modern Flexbox PDF Exporter using @react-pdf/renderer.
 * Guarantees zero text overlapping, auto-wrapping columns,
 * and Apple/Linear design system aesthetics.
 */
export async function exportModernEOBinderPDF(report: ClearanceReport): Promise<void> {
  const filename = `Form_EO_2026_${report.productionTitle.replace(/\s+/g, "_")}.pdf`;

  try {
    // Generate crisp vector PDF with Flexbox layout
    const blob = await pdf(<FormEOBinderDocument report={report} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (error) {
    console.warn("React-PDF client generation fallback to jsPDF:", error);
    // Bulletproof fallback to jsPDF if browser environment restricts web worker
    const doc = generateEOBinderPDF(report);
    doc.save(filename);
  }
}
