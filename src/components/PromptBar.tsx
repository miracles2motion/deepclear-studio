"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Paperclip, Sparkles, Play, ShieldCheck, DollarSign } from "lucide-react";

interface PromptBarProps {
  onSendMessage: (text: string) => void;
  onOpenUploadModal: () => void;
  onRunScan: () => void;
  isScanning: boolean;
  isCleared: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onSendMessage,
  onOpenUploadModal,
  onRunScan,
  isScanning,
  isCleared,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isScanning) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-5 pt-2">
      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
        <button
          onClick={onRunScan}
          disabled={isScanning}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] transition-all hover:text-white"
        >
          <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
          <span>Execute Swarm Scan</span>
        </button>

        <button
          onClick={() => onSendMessage("Negotiate the Rolex Submariner trademark hazard with the Director and Legal Counsel.")}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] transition-all hover:text-white"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Debate Rolex Compromise</span>
        </button>

        <button
          onClick={() => onSendMessage("Calculate Georgia 30% film tax credit arbitrage for this scene.")}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] transition-all hover:text-white"
        >
          <DollarSign className="h-3 w-3 text-sky-400" />
          <span>Arbitrage Tax Rebate</span>
        </button>
      </div>

      {/* Main Floating Input Container */}
      <div className="relative bg-[#141416] border border-white/[0.08] focus-within:border-white/20 rounded-2xl p-2.5 shadow-2xl transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question, paste a script excerpt, or command the clearance agents..."
          rows={1}
          className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none px-2 py-1 max-h-32 min-h-[38px] leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
          {/* File Upload Trigger */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all flex items-center gap-1.5 text-xs"
            title="Upload Script or Storyboard (.fountain, .md, .png)"
          >
            <Paperclip className="h-4 w-4" />
            <span className="hidden sm:inline">Attach File (.md / .fountain)</span>
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isScanning}
            className="h-8 w-8 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
