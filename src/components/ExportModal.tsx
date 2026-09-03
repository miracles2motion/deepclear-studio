"use client";

import React, { useState } from "react";
import { ClearanceReport, ExtractedEntity } from "@/types";
import { exportModernEOBinderPDF } from "@/lib/reactPdfExporter";
import { generateClearanceMerkleHash, mintClearancePassportTestnet } from "@/lib/web3";
import { X, ShieldCheck, Download, ExternalLink, CheckCircle2, Lock, Film, Copy, Check, Edit3, Loader2 } from "lucide-react";
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
  licensedEntityIds?: string[];
  finalScriptText?: string;
  uploadedFileName?: string | null;
  onUpdateTitle?: (title: string) => void;
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
  licensedEntityIds = [],
  finalScriptText,
  uploadedFileName,
  onUpdateTitle,
}) => {
  const [activeTitle, setActiveTitle] = useState(productionTitle);
  const [isMinting, setIsMinting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    explorerUrl: string;
    blockNumber: number;
  } | null>(null);

  // Sync title if prop updates
  React.useEffect(() => {
    setActiveTitle(productionTitle);
  }, [productionTitle]);

  if (!isOpen) return null;

  const currentTitle = activeTitle.trim() || "Indie Narrative Production";
  const isFullyCleared = currentExposure === 0 && initialExposure > 0;
  const merkleHash = generateClearanceMerkleHash(currentTitle, entities, new Date().toISOString());

  // Download Form E&O-2026 PDF using modern @react-pdf/renderer Flexbox engine
  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    const report: ClearanceReport = {
      id: `CERT-EO-${Date.now().toString().slice(-6)}`,
      productionTitle: currentTitle,
      totalScenes: 1,
      initialExposureUsd: initialExposure,
      finalExposureUsd: currentExposure,
      potentialTaxRebateUsd: taxSavings,
      taxJurisdiction: taxJurisdiction || "Qualified Film Credit",
      entities,
      clearedEntityIds,
      licensedEntityIds,
      debateTurns: [],
      merkleRootHash: merkleHash,
      onChainTxHash: mintResult?.txHash,
      generatedAt: new Date().toISOString(),
      eandOPolicyStatus: currentExposure === 0 ? "APPROVED" : "PENDING_REMEDY",
    };

    try {
      await exportModernEOBinderPDF(report);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Fallback
      }
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Download Cleared Screenplay in user-chosen format (Single file only)
  const handleDownloadScriptFormat = (format: "fountain" | "md" | "txt") => {
    if (!finalScriptText) return;

    const baseName = uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : currentTitle.replace(/\s+/g, "_");

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

  const handleMintOnChain = async () => {
    setIsMinting(true);
    try {
      const res = await mintClearancePassportTestnet(merkleHash, currentTitle);
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
              Distribution Clearance & Export
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Form E&O-2026 Binder • Mutated Screenplay • Web3 Passport
            </p>
          </div>
        </div>

        {/* Executive Summary Metrics Card */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.08] space-y-2.5 mb-5 font-mono text-xs">
          {/* Editable Production Title */}
          <div className="flex justify-between items-center text-zinc-300 gap-2">
            <span className="text-zinc-400 shrink-0">Production Title:</span>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <input
                type="text"
                value={activeTitle}
                onChange={(e) => {
                  setActiveTitle(e.target.value);
                  if (onUpdateTitle) onUpdateTitle(e.target.value);
                }}
                placeholder="Enter Project Title..."
                className="bg-zinc-800 border border-white/10 focus:border-emerald-500/50 rounded px-2 py-0.5 text-xs text-white font-sans font-semibold focus:outline-none max-w-[220px] text-right"
              />
              <Edit3 className="h-3 w-3 text-zinc-500 shrink-0" />
            </div>
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

        {/* Explicit Single-File Download Actions */}
        <div className="space-y-3">
          {/* Primary Action: Download Form E&O-2026 PDF (Single File) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all disabled:opacity-60"
          >
            {isExportingPDF ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>
              {isExportingPDF ? "Generating Flexbox Binder..." : "Download Form E&O-2026 Binder (.PDF)"}
            </span>
          </button>

          {/* Screenplay Options */}
          {finalScriptText && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                  <Film className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Download Cleared Screenplay:</span>
                </span>
                {/* Copy Button */}
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-300 text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span className="text-[10px]">Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Explicit Single-Format Download Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownloadScriptFormat("fountain")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-emerald-500/40 flex items-center justify-center gap-1"
                >
                  <Download className="h-3 w-3 text-emerald-400" />
                  <span>.fountain</span>
                </button>
                <button
                  onClick={() => handleDownloadScriptFormat("md")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-sky-500/40 flex items-center justify-center gap-1"
                >
                  <Download className="h-3 w-3 text-sky-400" />
                  <span>.md</span>
                </button>
                <button
                  onClick={() => handleDownloadScriptFormat("txt")}
                  className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs font-mono transition-all text-center hover:border-zinc-500/40 flex items-center justify-center gap-1"
                >
                  <Download className="h-3 w-3 text-zinc-400" />
                  <span>.txt</span>
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
