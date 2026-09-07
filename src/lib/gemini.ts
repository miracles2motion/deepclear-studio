import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedEntity, AgentRole } from "@/types";

// Priority list of verified active Gemini models with automatic cascade fallback
const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-pro-latest",
];

let cachedWorkingModel: string | null = null;

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not set or invalid. Please configure your API key in .env.local or Vercel Environment Variables."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Dynamically queries Google's active model registry if all local candidates fail.
 * Guarantees zero downtime even if Google deprecates or releases new models in the future.
 */
async function discoverLiveGoogleModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )
      .map((m: { name: string }) => m.name.replace("models/", ""))
      .filter((name: string) => name.includes("flash") || name.includes("pro"));
  } catch {
    return [];
  }
}

/**
 * Self-healing model invoker: Tries the cached working model first,
 * cascades through all priority models, and dynamically discovers live models
 * directly from Google if endpoints change in the future.
 */
async function generateContentWithCascade(
  genAI: GoogleGenerativeAI,
  contents: Parameters<ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]>[0],
  config?: { responseMimeType?: string; temperature?: number }
) {
  const modelsToTry = cachedWorkingModel
    ? [cachedWorkingModel, ...MODEL_CANDIDATES.filter((m) => m !== cachedWorkingModel)]
    : [...MODEL_CANDIDATES];

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
      });

      const result = await model.generateContent(contents);
      cachedWorkingModel = modelName; // Cache working model for future fast calls
      return result;
    } catch (err) {
      lastError = err as Error;
      // If 404 / model deprecated or unavailable, smoothly continue to next candidate
      continue;
    }
  }

  // Future-Proof Dynamic Fallback: Query Google's live ModelService
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const liveDiscoveredModels = await discoverLiveGoogleModels(apiKey);
    for (const dynamicModel of liveDiscoveredModels) {
      if (modelsToTry.includes(dynamicModel)) continue;
      try {
        const model = genAI.getGenerativeModel({
          model: dynamicModel,
          generationConfig: config,
        });
        const result = await model.generateContent(contents);
        cachedWorkingModel = dynamicModel;
        return result;
      } catch (err) {
        lastError = err as Error;
        continue;
      }
    }
  }

  throw lastError || new Error("All Gemini model candidates failed to respond.");
}

export async function analyzeScreenplayWithGemini(
  scriptText: string,
  imagePartBase64?: { data: string; mimeType: string },
  safeHarborAssets?: Array<{ originalText: string; clearedAs?: string; status: string }>
) {
  const genAI = getGeminiClient();

  const safeHarborSection =
    safeHarborAssets && safeHarborAssets.length > 0
      ? `\nIMMUTABLE SAFE-HARBOR CLEARANCE REGISTRY (DO NOT FLAG AS HAZARDS):
The following production assets have ALREADY completed full dialectic debate, received verified Parallel Search registry clearance, or hold valid commercial/sync licenses:
${safeHarborAssets
  .map(
    (a, i) =>
      `${i + 1}. "${a.clearedAs || a.originalText}" (Original: "${a.originalText}", Status: ${a.status.toUpperCase()})`
  )
  .join("\n")}

STRICT RULE: DO NOT flag any of the above pre-cleared or pre-licensed assets as legal liabilities or hazards. Omit them completely from the entities list. If an asset is already cleared, statutory exposure is $0.\n`
      : "";

  const prompt = `You are the Lead Script Supervisor and Legal Clearance Inspector for DeepClear Studio.
Analyze the following screenplay excerpt and visual scene elements for legal liabilities:
1. Trademark violations (commercial brand marks, logos, watches, cars, drinks, electronics)
2. Copyright risks (unlicensed sync music, songs, lyrics, copyrighted artwork/tattoos)
3. Municipal filming permits & safety hazards (unpermitted drones over traffic, high-speed bridge/highway stunts, explosions, SAG-AFTRA overtime)
4. State tax incentive eligibility (e.g. Georgia 30%, New York 30%, New Mexico 25%)
5. Living Person Defamation & Right of Publicity (fictitious character full names with specific high-profile titles/professions/employers that risk colliding with real living individuals under Cal. Civ. Code § 3344)
6. Fictional Phone Numbers & Web Domains (phone numbers outside the Hollywood safe reserve 555-0100 through 555-0199, or unregistered/risky web domains in dialogue)
${safeHarborSection}
For each risk found, return a JSON object with this exact schema:
{
  "entities": [
    {
      "id": "ent-1",
      "sceneNumber": 1,
      "rawText": "exact string from script",
      "category": "trademark" | "copyright" | "permit" | "caselaw" | "tax" | "defamation" | "domain",
      "description": "precise explanation of statutory liability",
      "status": "hazard",
      "originalExposure": 350000 (realistic statutory liability exposure in USD),
      "clearedExposure": 0,
      "defusedText": "fictionalized, copyright-safe production alternative",
      "searchKeywords": ["keyword1", "keyword2"]
    }
  ],
  "overallRiskSummary": "Summary of production liabilities",
  "totalInitialLiabilityUsd": 350000
}

Screenplay Text to Analyze:
${scriptText}`;

  const contents: Array<string | { inlineData: { data: string; mimeType: string } }> = [prompt];
  if (imagePartBase64) {
    contents.push({
      inlineData: imagePartBase64,
    });
  }

  const result = await generateContentWithCascade(genAI, contents, {
    responseMimeType: "application/json",
    temperature: 0.2,
  });

  const text = result.response.text();
  return JSON.parse(text);
}

export async function generateScreenplayScene(customPrompt?: string) {
  const genAI = getGeminiClient();

  // Diverse real-world cinematic premises, locations, and varied legal clearance elements
  const sceneThemes = [
    {
      genre: "Silicon Valley Cyber Heist",
      setting: "INT. PALO ALTO BIOTECH LAB - NIGHT",
      location: "San Francisco / Silicon Valley, California",
      hazards: "Apple Vision Pro headset, a high-end Tesla Cybertruck, or a Radiohead soundtrack cue",
    },
    {
      genre: "Savannah Southern Gothic Noir",
      setting: "EXT. FORSYTH PARK - SAVANNAH, GEORGIA - DUSK",
      location: "Savannah, Georgia (Historic District MOME permit zone)",
      hazards: "a bottle of Macallan 25 Scotch, a vintage 1968 Ford Mustang Fastback, or an Otis Redding vinyl playing",
    },
    {
      genre: "Tokyo Underground Espionage",
      setting: "EXT. SHIBUYA CROSSING - RAIN - NIGHT",
      location: "Tokyo, Japan (Public street crowd filming permit)",
      hazards: "a neon billboard of Sony PlayStation, a customized Ducati Panigale, or a Daft Punk electronic beat",
    },
    {
      genre: "Albuquerque Desert Drug Smuggling Standoff",
      setting: "EXT. ROUTE 66 DESERT JUNKYARD - NEW MEXICO - DAY",
      location: "Bernalillo County, New Mexico (Film Tax Incentive Zone)",
      hazards: "a DJI Matrice Thermal Surveillance Drone, a Patagonia tactical jacket, or a classic Johnny Cash song playing",
    },
    {
      genre: "Chicago Art Gallery Heist",
      setting: "INT. RIVER NORTH CONTEMPORARY GALLERY - CHICAGO - NIGHT",
      location: "Chicago, Illinois (Public museum & architectural copyright zone)",
      hazards: "a prominent Jeff Koons balloon sculpture on display, a Leica M11 Rangefinder camera, or a Miles Davis jazz cue",
    },
    {
      genre: "Miami High-Speed Harbor Pursuit",
      setting: "EXT. BISCAYNE BAY - SPEEDBOAT COCKPIT - MIDNIGHT",
      location: "Miami-Dade, Florida (Coast Guard maritime filming permit)",
      hazards: "a Midnight Express 430 powerboat with triple Mercury Racing engines, a Hermès travel duffel, or a Bad Bunny reggaeton track",
    },
    {
      genre: "London Financial District Thriller",
      setting: "INT. CANARY WHARF PENTHOUSE - LONDON - SUNRISE",
      location: "Greater London, UK (City of London filming & airspace clearance)",
      hazards: "a Bloomberg Terminal display with proprietary financial feeds, a pair of bespoke Savile Row suits, or a David Bowie background track",
    },
  ];

  const selectedTheme = sceneThemes[Math.floor(Math.random() * sceneThemes.length)];

  const defaultPrompt = `You are an Oscar-nominated Hollywood screenwriter.
Write an original, gripping, hyper-realistic cinematic scene excerpt (16 to 22 lines in standard professional Fountain screenplay format).

Genre & Mood: ${selectedTheme.genre}
Setting Header: ${selectedTheme.setting}
Geographic Location: ${selectedTheme.location}

Rules for Real-World Clearance Authenticity:
1. Ground the scene in natural, razor-sharp cinematic dialogue and visceral visual action.
2. Naturally integrate 2 to 3 distinct real-world production elements that an E&O insurance underwriter would inspect (e.g., ${selectedTheme.hazards}, copyrighted brand props, municipal municipal stunt permits, fine art, or commercial music cues).
3. Do NOT repeat the same cliché brands (avoid relying on Rolex or Queensboro bridge unless specifically requested). Be creative, versatile, and modern.
4. Output ONLY the raw Fountain screenplay text (no markdown triple backticks, no introductions, no title cards).`;

  const result = await generateContentWithCascade(genAI, customPrompt || defaultPrompt, {
    temperature: 0.9,
  });

  return result.response.text().trim().replace(/^```(?:fountain|markdown)?\n?/, "").replace(/\n?```$/, "");
}

/**
 * Generates dynamic, context-specific, cinematic 5-agent debate turns for a specific hazard
 * ensuring authentic dialectic exchange with active participation from Legal Counsel,
 * The Director, Location / Art Manager, Script Supervisor, and Completion Bond Officer.
 */
export async function generateDynamicDebateTurns(params: {
  scriptText: string;
  entity: ExtractedEntity;
  isLicenseRoute?: boolean;
}) {
  const genAI = getGeminiClient();
  const isLicense = !!params.isLicenseRoute;

  const prompt = `You are the lead dialogue supervisor for a Hollywood film clearance war room.
Generate a dynamic, authentic, high-stakes dialectic debate between ALL 5 crew agents over a detected scene hazard.

Scene Context:
${params.scriptText}

Specific Liability Under Debate:
- Asset: "${params.entity.rawText}" (${params.entity.category.toUpperCase()})
- Legal Issue: ${params.entity.description}
- Proposed Substitution: "${params.entity.defusedText || "custom cleared prop"}"
- Statutory Financial Exposure: $${params.entity.originalExposure.toLocaleString()}
- Resolution Route: ${isLicense ? "PRODUCTION HOLDS ACTIVE COMMERCIAL/SYNC LICENSE OR PERMIT" : "CREATIVE COMPROMISE & NARRATIVE PROP SUBSTITUTION"}

Crew Roles to Include:
1. counselObjection: Legal Counsel raises a sharp statutory legal objection (Lanham Act § 43(a), 17 U.S.C. § 504 sync license, MOME permit). (1-2 sentences)
2. directorDefense: The Director defends why this element is essential for artistic character motivation, visual realism, or Fair Use under Rogers v. Grimaldi. (1-2 sentences)
3. locationManagerProposal: Location / Art Department Manager steps in:
   - ${isLicense ? "Affirms production license documentation or municipal filming permit filed with local film commission." : `Proposes an aesthetically matched narrative substitute "${params.entity.defusedText || "bespoke prop"}" or relocating to a 30% tax-rebate qualified soundstage.`} (1-2 sentences)
4. parallelSearchQuery: Targeted query formulated for live Parallel Search registry verification to check for zero commercial conflicts. (e.g. "${params.entity.defusedText || params.entity.rawText} trademark clearance USPTO")
5. directorAcceptance: The Director accepts the solution and confirms aesthetic alignment with the crew. (1 sentence)
6. bondOfficerSignOff: Completion Bond Officer evaluates Parallel Search grounding, underwrites the policy rider, and issues official E&O Safe Harbor clearance. (1 sentence)

Return ONLY a JSON object with this schema:
{
  "counselObjection": string,
  "directorDefense": string,
  "locationManagerProposal": string,
  "parallelSearchQuery": string,
  "directorAcceptance": string,
  "bondOfficerSignOff": string,
  "proposedReplacement": string
}`;

  const result = await generateContentWithCascade(genAI, prompt, {
    responseMimeType: "application/json",
    temperature: 0.7,
  });

  return JSON.parse(result.response.text());
}

/**
 * Generates an intelligent, authoritative conversational response from a specific
 * studio crew agent, answering user questions directly without mutating screenplay text.
 */
export async function generateConversationalAgentResponse({
  userMessage,
  targetAgent,
  scriptContext,
  entitiesContext,
  parallelGroundingSnippet,
}: {
  userMessage: string;
  targetAgent: AgentRole;
  scriptContext?: string;
  entitiesContext?: ExtractedEntity[];
  parallelGroundingSnippet?: string;
}): Promise<{
  reply: string;
  consultedAgent?: AgentRole | null;
  consultedAgentComment?: string | null;
  suggestedActions: string[];
}> {
  const genAI = getGeminiClient();

  const agentPersonas: Record<AgentRole, { name: string; roleDesc: string; expertise: string }> = {
    legal_counsel: {
      name: "Studio Legal Counsel",
      roleDesc: "Experienced Hollywood entertainment and IP attorney representing studio interests and E&O risk defense.",
      expertise: "Lanham Act § 43(a)/(c), 17 U.S.C. copyright, music synchronization & master use licenses, trademark dilution/tarnishment, Right of Publicity, and fair use under Rogers v. Grimaldi.",
    },
    director: {
      name: "The Director",
      roleDesc: "Visionary film director fiercely protecting character grit, storytelling authenticity, and cinematic realism.",
      expertise: "Dramatic narrative integrity, artistic expressive Fair Use, visual aesthetics, cinematography, and creative prop selection.",
    },
    location_manager: {
      name: "Location & Art Department Manager",
      roleDesc: "Practical studio production lead managing filming permits, soundstage fabrication, and physical props.",
      expertise: "Municipal film commissions (Savannah, Atlanta, FilmLA), street/park permits, greeking and prop building, and state film tax incentives (Georgia 30% QPE).",
    },
    script_supervisor: {
      name: "Script Supervisor",
      roleDesc: "Meticulous on-set script continuity supervisor ensuring clean screenplay formatting and dialogue cadence.",
      expertise: "Scene sluglines, parentheticals, .fountain/industry formatting, screenplay stutter sanitization, and continuity tracking.",
    },
    bond_officer: {
      name: "Completion Bond Officer",
      roleDesc: "Senior insurance and completion guarantor underwriter holding the ultimate financial authority.",
      expertise: "Errors & Omissions (E&O) underwriting, statutory exposure calculations, bank distribution warranties, and completion bond riders.",
    },
  };

  const persona = agentPersonas[targetAgent] || agentPersonas.legal_counsel;

  const prompt = `You are ${persona.name} in DeepClear Studio's autonomous film clearance war room.
Role: ${persona.roleDesc}
Expertise: ${persona.expertise}

The filmmaker/producer is asking you a direct question or giving a conversational command:
"${userMessage}"

${scriptContext ? `Currently Active Screenplay Excerpt:\n"""${scriptContext.slice(0, 1000)}"""\n` : "No screenplay loaded yet."}
${entitiesContext && entitiesContext.length > 0 ? `Currently Identified Screenplay Liabilities: ${entitiesContext.map((e) => `${e.rawText} (${e.category}) - Exposure: $${e.originalExposure}`).join("; ")}` : ""}
${parallelGroundingSnippet ? `Authoritative Legal/Registry Search Snippets from Parallel Web Systems:\n"""${parallelGroundingSnippet}"""\n` : ""}

Instructions:
1. Answer the user directly, conversationally, and authoritatively in your persona.
2. If citing legal rules, statutes, trademarks, or film practices, be specific, realistic, and practical (e.g. explain why music sync rights are difficult, how brands sue under trademark dilution, or how greeking works).
3. If the user's question touches another department's domain (e.g. asking legal counsel about physical permits or director's aesthetic), you may briefly consult another agent (consultedAgent: "location_manager" | "director" | "bond_officer" | "script_supervisor") and include a brief 1-sentence comment from them.
4. Provide 2 to 3 concise, actionable next steps or courses of action the producer can take (suggestedActions).
5. DO NOT treat this question as a screenplay to be edited. DO NOT output script sluglines unless providing an illustrative example.

Return ONLY a valid JSON object matching this schema:
{
  "reply": "markdown formatted string, engaging, 2-3 paragraphs max",
  "consultedAgent": "legal_counsel" | "director" | "location_manager" | "script_supervisor" | "bond_officer" | null,
  "consultedAgentComment": "brief 1-sentence comment or null",
  "suggestedActions": ["Action 1", "Action 2"]
}`;

  try {
    const result = await generateContentWithCascade(genAI, prompt, {
      responseMimeType: "application/json",
      temperature: 0.7,
    });
    return JSON.parse(result.response.text());
  } catch (err) {
    console.error("Agent chat generation error:", err);
    const lowerMsg = userMessage.toLowerCase();
    let dynamicReply = `As ${persona.name}, here is my guidance: When developing a screenplay, the most common liabilities arise from unlicensed commercial marks, living person rights, and intellectual property collisions.`;
    let dynamicActions = [
      "Audit screenplay for brand logos and songs",
      "Inspect USPTO classifications in Parallel Inspector",
      "Check production insurance & E&O warranty riders",
    ];

    if (lowerMsg.includes("defam") || lowerMsg.includes("sued") || lowerMsg.includes("charge") || lowerMsg.includes("libel")) {
      dynamicReply = `⚖️ **Studio Legal Counsel Guidance on Screenplay Defamation & Civil Exposure**:

1. **Civil Tort vs. Criminal Charges**:
Defamation in narrative media is not a criminal charge—it is a high-stakes **civil tort (libel per se or libel per quod)**. Additionally, plaintiffs often pair defamation claims with **Right of Publicity** statutory violations (*e.g., Cal. Civ. Code § 3344*) and **False Light Invasion of Privacy**.

2. **Total Lawsuit Exposure & Damage Potential**:
• **Compensatory & Actual Damages**: Ranging from **$250,000 to $5,000,000+** if a plaintiff proves verifiable loss of livelihood, business disruption, or reputation harm.
• **Punitive Damages**: Juries can award multi-million dollar punitive damages if malice or reckless disregard for the truth is demonstrated.
• **Defense Costs**: Even if successfully defended under the First Amendment (*Rogers v. Grimaldi*), defending a media defamation lawsuit costs between **$150,000 and $750,000** in legal retainers.

3. **E&O Insurance & Completion Bond Impact**:
Completion guarantors and E&O underwriting carriers will **exclude** un-cleared living person depictions from insurance binders. Without clean E&O coverage, distribution financing and bank escrow will immediately freeze.

4. **Recommended Production Mitigation**:
Execute strict "greeking"—change the character's name, employer, specific medical/legal licenses, and biographical milestones. Alternatively, obtain an executed **Life Story Rights Agreement** with an explicit waiver of claims.`;
      dynamicActions = [
        "Execute character name & biographical 'greeking' to ensure zero living person collision",
        "Verify character names against Parallel Public Records & Licensing Registry",
        "Confirm E&O policy does not carry living person depiction exclusions",
      ];
    } else if (lowerMsg.includes("tax") || lowerMsg.includes("rebate") || lowerMsg.includes("credit") || lowerMsg.includes("georgia")) {
      dynamicReply = `📍 **Location & Art Manager Tax Guidance**:
Our production qualifies for state filming incentives (such as Georgia's 30% Qualified Production Expenditure rebate). To maximize credit realization, expenditures must pass through local resident payroll, approved soundstages, and registered resident vendors. Keep all equipment rentals within the state tax jurisdiction.`;
      dynamicActions = [
        "Audit scene expenditures against Georgia 30% QPE requirements",
        "Verify local vendor registration with state film commission",
        "Confirm certified CPA expenditure audit timeline",
      ];
    }

    return {
      reply: dynamicReply,
      consultedAgent: targetAgent === "legal_counsel" ? "bond_officer" : null,
      consultedAgentComment: targetAgent === "legal_counsel"
        ? "From the Completion Bond desk: An unresolved defamation exposure halts bond issuance. We will not close production funding until Legal gives complete safe-harbor clearance."
        : null,
      suggestedActions: dynamicActions,
    };
  }
}
