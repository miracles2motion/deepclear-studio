"use client";

import React, { useState } from "react";
import { ClearanceReport, ExtractedEntity } from "@/types";
import { generateEOBinderPDF } from "@/lib/pdfGenerator";
import { generateClearanceMerkleHash, mintClearancePassportTestnet } from "@/lib/web3";
import { X, ShieldCheck, Download, ExternalLink, CheckCircle2, Sparkles, FileText, Lock } from "lucide-react";
import confetti from "canvas-confetti";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionTitle: string;
  initialExposure: number;
  currentExposure: number;
  taxSavings: number;
  entities: ExtractedEntity[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  productionTitle,
  initialExposure,
  currentExposure,
  taxSavings,
  entities,
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    explorerUrl: string;
    blockNumber: number;
  } | null>(null);

  if (!isOpen) return null;

  const merkleHash = generateClearanceMerkleHash(productionTitle, entities, new Date().toISOString());

  const handleDownloadPDF = () => {
    const report: ClearanceReport = {
      id: `CERT-EO-${Date.now().toString().slice(-6)}`,
      productionTitle,
      totalScenes: 1,
      initialExposureUsd: initialExposure,
      finalExposureUsd: currentExposure,
      potentialTaxRebateUsd: taxSavings,
      entities,
      debateTurns: [],
      merkleRootHash: merkleHash,
      onChainTxHash: mintResult?.txHash,
      generatedAt: new Date().toISOString(),
      eandOPolicyStatus: currentExposure === 0 ? "APPROVED" : "PENDING_REMEDY",
    };

    const doc = generateEOBinderPDF(report);
    doc.save(`Form_EO_2026_${productionTitle.replace(/\s+/g, "_")}.pdf`);

    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleMintOnChain = async () => {
    setIsMinting(true);
    try {
      const res = await mintClearancePassportTestnet(merkleHash, productionTitle);
      setMintResult(res);

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface border border-surface-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-subtle"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Form E&O-2026 Insurance Underwriting Binder
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Official Hollywood Chain of Title Clearance Certification
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2 mb-4 font-mono text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Production Title:</span>
            <span className="font-bold text-white">{productionTitle}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Statutory Liability:</span>
            <span className="font-bold text-emerald-400">
              ${currentExposure.toLocaleString()} (100% Cleared)
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Tax Incentives Unlocked:</span>
            <span className="font-bold text-emerald-400">
              +${taxSavings.toLocaleString()} (Georgia 30%)
            </span>
          </div>
          <div className="flex justify-between text-slate-300 pt-2 border-t border-surface-border">
            <span>Merkle Audit Hash:</span>
            <span className="text-[10px] text-cyan-400 truncate max-w-[240px]">
              {merkleHash}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Form E&O-2026 PDF Binder</span>
          </button>

          {/* Mint On-Chain */}
          {!mintResult ? (
            <button
              onClick={handleMintOnChain}
              disabled={isMinting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface-elevated text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-all"
            >
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>{isMinting ? "Minting to Base Sepolia..." : "Mint On-Chain Clearance Passport (EVM)"}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>MINTED TO BASE SEPOLIA (BLOCK #{mintResult.blockNumber})</span>
              </div>
              <a
                href={mintResult.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline truncate"
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
