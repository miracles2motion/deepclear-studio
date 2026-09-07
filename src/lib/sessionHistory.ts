import { DeepClearSessionData, SavedSessionRecord } from "@/types";

const STORAGE_KEY = "deepclear_session_history_v1";
const ACTIVE_SESSION_KEY = "deepclear_active_session_id_v1";
const MAX_SAVED_SESSIONS = 50;

/**
 * Safely loads all saved session history records from browser localStorage
 */
export function loadSavedSessions(): SavedSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn("Failed to read session history from localStorage:", err);
    return [];
  }
}

/**
 * Gets the current active session ID (if tracked)
 */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Retrieves the full active session record from storage (for seamless reload recovery)
 */
export function getActiveSessionRecord(): SavedSessionRecord | null {
  const activeId = getActiveSessionId();
  if (!activeId) return null;
  const sessions = loadSavedSessions();
  return sessions.find((s) => s.id === activeId) || null;
}

/**
 * Sets the active session ID in storage
 */
export function setActiveSessionId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  } catch {
    // Ignore storage quota warnings
  }
}

/**
 * Clears the active session ID tracking
 */
export function clearActiveSessionId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Builds a brief readable preview snippet from the script or messages
 */
function createPreviewSnippet(sessionData: DeepClearSessionData): string {
  if (sessionData.currentScriptText && sessionData.currentScriptText.trim()) {
    const lines = sessionData.currentScriptText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const nonTitleLine = lines.find((l) => !l.toLowerCase().startsWith("title:"));
    if (nonTitleLine) {
      return nonTitleLine.length > 110 ? nonTitleLine.slice(0, 107) + "..." : nonTitleLine;
    }
  }
  const firstUserMsg = sessionData.messages.find((m) => m.sender === "user");
  if (firstUserMsg && firstUserMsg.content) {
    return firstUserMsg.content.length > 110
      ? firstUserMsg.content.slice(0, 107) + "..."
      : firstUserMsg.content;
  }
  return "Clearance & E&O Underwriting Session";
}

/**
 * Saves or updates a session in local storage history.
 * If targetId exists, updates that session in place and elevates it to top of list.
 * Otherwise creates a new session record.
 */
export function saveSessionToHistory(
  sessionData: DeepClearSessionData,
  targetId?: string
): SavedSessionRecord {
  const existing = loadSavedSessions();
  const id = targetId || `session-${Date.now()}`;
  const now = new Date().toISOString();

  const totalEntities = sessionData.entities ? sessionData.entities.length : 0;
  const clearedCount = sessionData.clearedEntityIds ? sessionData.clearedEntityIds.length : 0;
  const licensedCount = sessionData.licensedEntityIds ? sessionData.licensedEntityIds.length : 0;
  const resolvedCount = clearedCount + licensedCount;
  const resolvedPercent =
    totalEntities > 0
      ? Math.round((resolvedCount / totalEntities) * 100)
      : sessionData.initialExposure > 0 && sessionData.currentExposure === 0
      ? 100
      : 0;

  const record: SavedSessionRecord = {
    id,
    savedAt: now,
    title: sessionData.productionTitle || "Indie Production",
    previewSnippet: createPreviewSnippet(sessionData),
    initialExposure: sessionData.initialExposure || 0,
    currentExposure: sessionData.currentExposure || 0,
    resolvedPercent,
    taxSavings: sessionData.taxSavings || 0,
    taxJurisdiction: sessionData.taxJurisdiction || "Standard State Incentive",
    entityCount: totalEntities,
    clearedCount,
    licensedCount,
    sessionData,
  };

  // Filter out any previous entry with this ID and put updated one at head
  const filtered = existing.filter((item) => item.id !== id);
  const updated = [record, ...filtered].slice(0, MAX_SAVED_SESSIONS);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setActiveSessionId(id);
    } catch (err) {
      console.warn("Storage quota reached, pruning oldest sessions:", err);
      try {
        // Aggressively prune to top 5 and retry
        const pruned = [record, ...filtered].slice(0, 5);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
        setActiveSessionId(id);
      } catch (retryErr) {
        console.error("Critical localStorage write failure:", retryErr);
      }
    }
  }

  return record;
}

/**
 * Deletes a specific session from history by ID
 */
export function deleteSavedSession(sessionId: string): SavedSessionRecord[] {
  if (typeof window === "undefined") return [];
  const existing = loadSavedSessions();
  const updated = existing.filter((item) => item.id !== sessionId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (getActiveSessionId() === sessionId) {
      clearActiveSessionId();
    }
  } catch (err) {
    console.warn("Failed to delete session from localStorage:", err);
  }
  return updated;
}

/**
 * Clears all saved sessions
 */
export function clearAllSavedSessions(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (err) {
    console.warn("Failed to clear sessions:", err);
  }
}
