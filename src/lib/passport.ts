import { ClearancePassportData, ClearedAssetRecord } from "@/types";

const PASSPORT_HEADER_TAG = "---";
const PASSPORT_ID = "deepclear_passport";

/**
 * Embeds a cryptographic DeepClear Clearance & Licensing Passport as a standardized
 * YAML frontmatter header into a screenplay (Markdown, Fountain, or plain text).
 */
export function embedClearancePassport(
  scriptText: string,
  passport: ClearancePassportData
): string {
  // Strip any existing passport first to avoid duplicate headers
  const { cleanedScript } = extractClearancePassport(scriptText);

  const lines: string[] = [
    PASSPORT_HEADER_TAG,
    `${PASSPORT_ID}:`,
    `  version: "${passport.version}"`,
    `  production_title: "${passport.productionTitle.replace(/"/g, '\\"')}"`,
    `  merkle_root: "${passport.merkleRoot}"`,
    `  bond_policy_id: "${passport.bondPolicyId}"`,
    `  policy_status: "${passport.policyStatus}"`,
    `  timestamp: "${passport.timestamp}"`,
    `  assets:`,
  ];

  for (const asset of passport.assets) {
    lines.push(`    - original: "${asset.originalText.replace(/"/g, '\\"')}"`);
    if (asset.clearedAs) {
      lines.push(`      cleared_as: "${asset.clearedAs.replace(/"/g, '\\"')}"`);
    }
    lines.push(`      category: "${asset.category}"`);
    lines.push(`      status: "${asset.status}"`);
    if (asset.licenseRef) {
      lines.push(`      license_ref: "${asset.licenseRef.replace(/"/g, '\\"')}"`);
    }
    lines.push(`      parallel_verified: ${asset.parallelVerified}`);
  }

  lines.push(PASSPORT_HEADER_TAG);
  lines.push(""); // blank line before script body
  lines.push(cleanedScript.trim());

  return lines.join("\n");
}

/**
 * Extracts and verifies an embedded DeepClear Clearance Passport from an uploaded screenplay file.
 * Returns both the stripped clean script text and the parsed passport data.
 */
export function extractClearancePassport(rawText: string): {
  cleanedScript: string;
  passport: ClearancePassportData | null;
} {
  if (!rawText || !rawText.trim()) {
    return { cleanedScript: "", passport: null };
  }

  const trimmed = rawText.trim();

  // Pattern 1: YAML Frontmatter (starts with --- and contains deepclear_passport)
  const yamlMatch = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (yamlMatch && yamlMatch[1].includes(PASSPORT_ID)) {
    const yamlBody = yamlMatch[1];
    const scriptBody = yamlMatch[2];
    const parsed = parsePassportYaml(yamlBody);
    if (parsed) {
      return { cleanedScript: scriptBody.trim(), passport: parsed };
    }
  }

  // Pattern 2: Embedded HTML Comment block <!-- DEEPCLEAR_PASSPORT: {...} -->
  const commentMatch = trimmed.match(/<!--\s*DEEPCLEAR_PASSPORT:\s*(\{[\s\S]*?\})\s*-->/i);
  if (commentMatch && commentMatch[1]) {
    try {
      const json = JSON.parse(commentMatch[1]);
      const cleaned = trimmed.replace(commentMatch[0], "").trim();
      return { cleanedScript: cleaned, passport: json };
    } catch {
      // Fallback
    }
  }

  return { cleanedScript: trimmed, passport: null };
}

/**
 * Lightweight deterministic YAML reader for DeepClear Passport frontmatter
 * without requiring bulky external dependencies.
 */
function parsePassportYaml(yamlContent: string): ClearancePassportData | null {
  try {
    const lines = yamlContent.split(/\r?\n/);
    const passport: Partial<ClearancePassportData> = {
      version: "2026.1",
      assets: [],
    };

    let currentAsset: Partial<ClearedAssetRecord> | null = null;
    let inAssetsBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      if (trimmed.startsWith("version:")) {
        passport.version = extractValue(trimmed);
      } else if (trimmed.startsWith("production_title:")) {
        passport.productionTitle = extractValue(trimmed);
      } else if (trimmed.startsWith("merkle_root:")) {
        passport.merkleRoot = extractValue(trimmed);
      } else if (trimmed.startsWith("bond_policy_id:")) {
        passport.bondPolicyId = extractValue(trimmed);
      } else if (trimmed.startsWith("policy_status:")) {
        passport.policyStatus = extractValue(trimmed) as "APPROVED" | "PENDING_REMEDY";
      } else if (trimmed.startsWith("timestamp:")) {
        passport.timestamp = extractValue(trimmed);
      } else if (trimmed.startsWith("assets:")) {
        inAssetsBlock = true;
      } else if (inAssetsBlock) {
        if (trimmed.startsWith("- original:")) {
          if (currentAsset && currentAsset.originalText) {
            passport.assets?.push(currentAsset as ClearedAssetRecord);
          }
          currentAsset = {
            originalText: extractValue(trimmed.replace(/^- original:/, "original:")),
            parallelVerified: true,
            status: "cleared",
            category: "trademark",
          };
        } else if (currentAsset) {
          if (trimmed.startsWith("cleared_as:")) {
            currentAsset.clearedAs = extractValue(trimmed);
          } else if (trimmed.startsWith("category:")) {
            currentAsset.category = extractValue(trimmed);
          } else if (trimmed.startsWith("status:")) {
            currentAsset.status = extractValue(trimmed) as "cleared" | "licensed";
          } else if (trimmed.startsWith("license_ref:")) {
            currentAsset.licenseRef = extractValue(trimmed);
          } else if (trimmed.startsWith("parallel_verified:")) {
            currentAsset.parallelVerified = extractValue(trimmed) === "true";
          }
        }
      }
    }

    if (currentAsset && currentAsset.originalText) {
      passport.assets?.push(currentAsset as ClearedAssetRecord);
    }

    if (passport.merkleRoot && passport.productionTitle) {
      return passport as ClearancePassportData;
    }
  } catch {
    return null;
  }

  return null;
}

function extractValue(line: string): string {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return "";
  const raw = line.slice(colonIdx + 1).trim();
  return raw.replace(/^["']|["']$/g, "").trim();
}
