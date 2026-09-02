"use client";

import React, { useState } from "react";
import { ClearanceReport, ExtractedEntity } from "@/types";
import { generateEOBinderPDF } from "@/lib/pdfGenerator";
import { generateClearanceMerkleHash, mintClearancePassportTestnet } from "@/lib/web3";
import { X, ShieldCheck, Download, ExternalLink, CheckCircle2, Lock, FileText, Film } from "lucide-react";
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
}) => {
  const [isMinting, setIsMinting] = useState(false);
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

  // Download Cleared Screenplay File (.fountain / .md)
  const handleDownloadScript = () => {
    if (!finalScriptText) return;

    const blob = new Blob([finalScriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${productionTitle.replace(/\s+/g, "_")}_CLEARED_FINAL.fountain`;
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

  // Download Complete Distribution Package (PDF + Screenplay)
  const handleDownloadBundle = () => {
    handleDownloadPDF();
    setTimeout(() => {
      handleDownloadScript();
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
        <div className="space-y-2.5">
          {/* Complete Distribution Bundle */}
          <button
            onClick={handleDownloadBundle}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Full Distribution Bundle (PDF + Screenplay)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Download PDF only */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span>Form E&O-2026 (.PDF)</span>
            </button>

            {/* Download Cleared Screenplay only */}
            <button
              onClick={handleDownloadScript}
              disabled={!finalScriptText}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs disabled:opacity-40 transition-all"
            >
              <Film className="h-3.5 w-3.5 text-emerald-400" />
              <span>Final Script (.fountain)</span>
            </button>
          </div>

          {/* Mint On-Chain Passport */}
          {!mintResult ? (
            <button
              onClick={handleMintOnChain}
              disabled={isMinting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-mono transition-all mt-1"
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
