import React, { useState, useEffect } from "react";
import {
  History,
  X,
  RotateCcw,
  Download,
  Trash2,
  FileCheck2,
  ShieldAlert,
  Search,
  Plus,
  Clock,
  Sparkles,
  ExternalLink,
  Coins,
} from "lucide-react";
import { SavedSessionRecord, DeepClearSessionData } from "@/types";
import {
  loadSavedSessions,
  deleteSavedSession,
  clearAllSavedSessions,
} from "@/lib/sessionHistory";

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSession: (sessionData: DeepClearSessionData, sessionId: string) => void;
  onStartNewSession: () => void;
  currentSessionId: string | null;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  onRestoreSession,
  onStartNewSession,
  currentSessionId,
}) => {
  const [sessions, setSessions] = useState<SavedSessionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSessions(loadSavedSessions());
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.previewSnippet.toLowerCase().includes(q) ||
      s.taxJurisdiction.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSavedSession(id);
    setSessions(updated);
    setDeleteConfirmId(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all browser session history?")) {
      clearAllSavedSessions();
      setSessions([]);
    }
  };

  const handleExportJson = (session: SavedSessionRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const jsonString = JSON.stringify(session.sessionData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const cleanTitle = (session.title || "session")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    a.href = url;
    a.download = `deepclear_session_${cleanTitle}_${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white font-mono">
                  Recent Session History
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Local browser storage • Zero backend required • Auto-archived on topic switch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onStartNewSession();
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-all flex items-center gap-1.5 border border-white/[0.08]"
              title="Start a new blank session (auto-archives active session first)"
            >
              <Plus className="h-3.5 w-3.5 text-sky-400" />
              <span>New Session</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {sessions.length > 0 && (
          <div className="px-5 pt-3 pb-2 border-b border-white/[0.06] bg-zinc-950/70">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions by production title or keyword..."
                className="w-full bg-zinc-900/90 border border-white/[0.08] rounded-xl pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-sky-500/50 font-mono"
              />
            </div>
          </div>
        )}

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y-0">
          {sessions.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center mx-auto text-zinc-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-300 font-mono">
                  No Saved Sessions Yet
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Whenever you analyze a screenplay, resolve liabilities, or switch to another
                  topic, DeepClear automatically snapshots your work here.
                </p>
              </div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500 font-mono">
              No sessions matched &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isResolved = session.currentExposure === 0 && session.entityCount > 0;

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all relative group flex flex-col gap-2.5 ${
                    isActive
                      ? "bg-sky-950/20 border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                      : "bg-zinc-900/50 hover:bg-zinc-900/90 border-white/[0.07] hover:border-white/20"
                  }`}
                >
                  {/* Top Row: Title, Active Pill, Date & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-white font-mono truncate">
                          {session.title}
                        </h4>
                        {isActive && (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            Active Now
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {formatTimestamp(session.savedAt)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-mono">
                        {session.previewSnippet}
                      </p>
                    </div>

                    {/* Quick Card Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleExportJson(session, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800 transition-all"
                        title="Download JSON Export"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      {deleteConfirmId === session.id ? (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(session.id, e)}
                          className="px-2 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] font-mono hover:bg-rose-900 transition-all"
                        >
                          Confirm Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(session.id);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all"
                          title="Delete this session record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata Chips: Exposure, Tax, Entities */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                    {/* Exposure Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 font-semibold ${
                        isResolved
                          ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-300"
                          : "bg-amber-950/50 border-amber-500/30 text-amber-300"
                      }`}
                    >
                      {isResolved ? (
                        <FileCheck2 className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="h-3 w-3 text-amber-400" />
                      )}
                      <span>
                        {session.currentExposure === 0
                          ? "$0 Exposure (100% Safe Harbor)"
                          : `${formatCurrency(session.currentExposure)} Exposure`}
                      </span>
                    </span>

                    {/* Tax Savings Chip */}
                    {session.taxSavings > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-sky-950/40 border border-sky-500/25 text-sky-300 flex items-center gap-1">
                        <Coins className="h-3 w-3 text-sky-400" />
                        <span>
                          {formatCurrency(session.taxSavings)} Saved ({session.taxJurisdiction.split(" ")[0]})
                        </span>
                      </span>
                    )}

                    {/* Entity Count */}
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800/80 text-zinc-400 border border-white/[0.05]">
                      {session.entityCount} {session.entityCount === 1 ? "Liability" : "Liabilities"} (
                      {session.clearedCount} cleared, {session.licensedCount} licensed)
                    </span>
                  </div>

                  {/* Bottom Row: Restore Action */}
                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {session.sessionData.messages?.length || 0} messages in feed
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onRestoreSession(session.sessionData, session.id);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restore Session</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-zinc-900/60 flex items-center justify-between text-xs font-mono">
          {sessions.length > 0 ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-zinc-500 hover:text-rose-400 transition-colors text-[11px]"
            >
              Clear All History
            </button>
          ) : (
            <span className="text-zinc-600 text-[11px]">Storage Healthy</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
