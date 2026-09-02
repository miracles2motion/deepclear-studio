"use client";

import React, { useState } from "react";
import { ClearanceReport, ExtractedEntity } from "@/types";
import { generateEOBinderPDF } from "@/lib/pdfGenerator";
import { generateClearanceMerkleHash, mintClearancePassportTestnet } from "@/lib/web3";
import { X, ShieldCheck, Download, ExternalLink, CheckCircle2, Lock, FileText, Film, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionTitle: string;
  initialExposure: number;
  currentExposure: number;
  taxSavings: number;
  taxJurisdiction?: string;
  entities: ExtractedEntity[];
  clearedEntityIds?: string[];
  finalScriptText?: string;
  uploadedFileName?: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  productionTitle,
  initialExposure,
  currentExposure,
  taxSavings,
  taxJurisdiction,
  entities,
  clearedEntityIds = [],
  finalScriptText,
  uploadedFileName,
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    explorerUrl: string;
    blockNumber: number;
  } | null>(null);

  if (!isOpen) return null;

  const isFullyCleared = currentExposure === 0 && initialExposure > 0;
  const merkleHash = generateClearanceMerkleHash(productionTitle, entities, new Date().toISOString());

  // Download Form E&O-2026 PDF
  const handleDownloadPDF = () => {
    const report: ClearanceReport = {
      id: `CERT-EO-${Date.now().toString().slice(-6)}`,
      productionTitle,
      totalScenes: 1,
      initialExposureUsd: initialExposure,
      finalExposureUsd: currentExposure,
      potentialTaxRebateUsd: taxSavings,
      taxJurisdiction: taxJurisdiction || "Qualified Film Credit",
      entities,
      clearedEntityIds,
      debateTurns: [],
      merkleRootHash: merkleHash,
      onChainTxHash: mintResult?.txHash,
      generatedAt: new Date().toISOString(),
      eandOPolicyStatus: currentExposure === 0 ? "APPROVED" : "PENDING_REMEDY",
    };

    const doc = generateEOBinderPDF(report);
    doc.save(`Form_EO_2026_${productionTitle.replace(/\s+/g, "_")}.pdf`);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Fallback
    }
  };

  // Download Cleared Screenplay File in user's desired format
  const handleDownloadScriptFormat = (format: "fountain" | "md" | "txt") => {
    if (!finalScriptText) return;

    const baseName = uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : productionTitle.replace(/\s+/g, "_");

    const blob = new Blob([finalScriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}_CLEARED_FINAL.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {
      // Fallback
    }
  };

  // Copy Final Screenplay Text
  const handleCopyScript = () => {
    if (!finalScriptText || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(finalScriptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Download Complete Distribution Package (PDF + .fountain Screenplay)
  const handleDownloadBundle = () => {
    handleDownloadPDF();
    setTimeout(() => {
      handleDownloadScriptFormat("fountain");
    }, 400);
  };

  const handleMintOnChain = async () => {
    setIsMinting(true);
    try {
      const res = await mintClearancePassportTestnet(merkleHash, productionTitle);
      setMintResult(res);

      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {
        // Fallback
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#121214] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-zinc-100 font-sans">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-zinc-800 border border-white/10 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Distribution Clearance & Delivery Package
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Form E&O-2026 Binder • Mutated Screenplay • Web3 Passport
            </p>
          </div>
        </div>

        {/* Executive Summary Metrics Card */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.08] space-y-2.5 mb-5 font-mono text-xs">
          <div className="flex justify-between items-center text-zinc-300">
            <span className="text-zinc-400">Production Title:</span>
            <span className="font-semibold text-white truncate max-w-[200px]">{productionTitle}</span>
          </div>

          <div className="flex justify-between items-center text-zinc-300">
            <span className="text-zinc-400">Statutory Liability:</span>
            <span className={`font-bold ${isFullyCleared ? "text-emerald-400" : "text-rose-400"}`}>
              ${currentExposure.toLocaleString()} {isFullyCleared ? "(100% Cleared)" : "(Active Exposure)"}
            </span>
          </div>

          <div className="flex justify-between items-center text-zinc-300">
            <span className="text-zinc-400">Tax Incentive:</span>
            <span className="font-semibold text-emerald-400 truncate max-w-[200px]">
              +${taxSavings.toLocaleString()} ({taxJurisdiction || "Qualified Film Credit"})
            </span>
          </div>

          <div className="flex justify-between items-center text-zinc-300 pt-2 border-t border-white/5">
            <span className="text-zinc-400">SHA-256 Merkle Hash:</span>
            <span className="text-[10px] text-zinc-400 truncate max-w-[180px]">
              {merkleHash}
            </span>
          </div>
        </div>

        {/* Delivery Download Actions */}
        <div className="space-y-3">
          {/* Complete Distribution Bundle */}
          <button
            onClick={handleDownloadBundle}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Full Distribution Bundle (PDF + Screenplay)</span>
          </button>

          {/* Primary Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Download PDF only */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span>Form E&O-2026 (.PDF)</span>
            </button>

            {/* Copy Screenplay Text */}
            <button
              onClick={handleCopyScript}
              disabled={!finalScriptText}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs disabled:opacity-40 transition-all"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copy Screenplay Text</span>
                </>
              )}
            </button>
          </div>

          {/* Screenplay Format Download Options */}
          {finalScriptText && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Film className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Download Screenplay Format:</span>
                </span>
                <span className="text-[10px] text-zinc-500">Industry Standard</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownloadScriptFormat("fountain")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-emerald-500/40"
                >
                  .fountain
                </button>
                <button
                  onClick={() => handleDownloadScriptFormat("md")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-sky-500/40"
                >
                  .md (Markdown)
                </button>
                <button
                  onClick={() => handleDownloadScriptFormat("txt")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-zinc-500/40"
                >
                  .txt (Text)
                </button>
              </div>
            </div>
          )}

          {/* Mint On-Chain Passport */}
          {!mintResult ? (
            <button
              onClick={handleMintOnChain}
              disabled={isMinting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-mono transition-all"
            >
              <Lock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isMinting ? "Minting to Base Sepolia..." : "Mint On-Chain Clearance Passport (EVM)"}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>MINTED TO BASE SEPOLIA (BLOCK #{mintResult.blockNumber})</span>
              </div>
              <a
                href={mintResult.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:underline truncate text-[11px]"
              >
                <span>Tx: {mintResult.txHash}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
