"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, X, Sparkles, Check } from "lucide-react";

interface ScriptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestScript: (data: {
    title: string;
    scriptText: string;
    imageBase64?: string;
  }) => void;
}

export const ScriptUploadModal: React.FC<ScriptUploadModalProps> = ({
  isOpen,
  onClose,
  onIngestScript,
}) => {
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [title, setTitle] = useState("Custom Indie Production");
  const [pastedText, setPastedText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Script File Upload (.fountain, .txt, .md, .pdf)
  const handleScriptFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedText(content);
    };
    reader.readAsText(file);
  };

  // Handle Storyboard Image Upload (.jpg, .png, .webp)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = (event.target?.result as string)?.split(",")[1];
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!pastedText.trim()) return;

    onIngestScript({
      title: title.trim() || "Custom Indie Production",
      scriptText: pastedText.trim(),
      imageBase64,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-surface-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-subtle transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-400">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Import Screenplay & Production Assets
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Upload .fountain, .txt, .md scripts or paste scene dialogue for autonomous clearance.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-subtle border border-surface-border mb-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "paste"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paste Script Text</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "upload"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Script & Storyboard Files</span>
          </button>
        </div>

        {/* Production Title Input */}
        <div className="mb-3">
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Production Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Neon Eclipse"
            className="w-full bg-surface-subtle border border-surface-border rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Tab 1: Paste Script */}
        {activeTab === "paste" ? (
          <div className="flex-1 flex flex-col min-h-[220px]">
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Screenplay / Dialogue Text (.fountain, Markdown, or Standard Script)
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="EXT. CITY STREET - NIGHT&#10;&#10;JOHN sips from a can of PEPSI while holding a SONY handycam..."
              className="flex-1 w-full bg-surface-subtle border border-surface-border rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 resize-none min-h-[180px] leading-relaxed"
            />
          </div>
        ) : (
          /* Tab 2: Upload Files */
          <div className="flex-1 space-y-3 min-h-[220px]">
            {/* Script File Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-surface-border hover:border-cyan-400/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-surface-subtle/50 hover:bg-surface-subtle transition-all text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".fountain,.txt,.md,.pdf"
                onChange={handleScriptFileUpload}
                className="hidden"
              />
              <FileText className="h-7 w-7 text-cyan-400 mb-2" />
              <p className="text-xs font-semibold text-white">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : "Click to upload Script (.fountain, .md, .txt)"}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Drag and drop screenplay files directly
              </p>
            </div>

            {/* Optional Storyboard Frame Upload */}
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-surface-border hover:border-emerald-400/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-surface-subtle/50 hover:bg-surface-subtle transition-all text-center"
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
              <ImageIcon className="h-6 w-6 text-emerald-400 mb-1.5" />
              <p className="text-xs font-semibold text-white">
                {imageFileName ? `Loaded Storyboard: ${imageFileName}` : "Optional: Upload Storyboard Frame (.png, .jpg)"}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Multimodal vision will scan for branded logos and props
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-surface-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!pastedText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load into Clearance Swarm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
