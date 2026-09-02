import { PresetScenario, ExtractedEntity } from "@/types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "scifi-nightmare",
    title: "The Indie Sci-Fi Nightmare",
    genre: "Cyberpunk / Tech Thriller",
    description:
      "A high-stakes scene with an unvetted luxury watch, unpermitted Los Angeles bridge drone chase, and unlicensed background pop track.",
    initialRiskUsd: 2840000,
    scriptText: `EXT. 6TH STREET VIADUCT - LOS ANGELES - NIGHT

Rain lashes the concrete arches. KAI (28) stands on the edge, neon light reflecting off his vintage ROLEX SUBMARINER. 

He checks his wrist, nervous. In the background, "RUNNING UP THAT HILL" by Kate Bush blares from a passing tuner car.

KAI
(into comms)
The node is live. Launching the heavy payload drone now.

He hits a detonator on a RED BULL can modified into a high-frequency EMP trigger. A high-speed quadcopter tears across active traffic lanes towards the downtown skyline.`,
  },
  {
    id: "historical-benchmark",
    title: "Historical Clearance Benchmark",
    genre: "Legal Drama / Re-creation",
    description:
      "Recreates real-world multi-million dollar Hollywood litigation scenarios: the Mike Tyson face tattoo and unpermitted architectural copyright.",
    initialRiskUsd: 1450000,
    scriptText: `INT. LUXURY HOTEL PENTHOUSE - BANGKOK - MORNING

MARCUS (35) wakes up groggy on the king bed. He stumbles to the mirror. 

Across his left temple is an exact recreation of the iconic MIKE TYSON NEO-MAORI TRIBAL TATTOO.

MARCUS
What did we do last night?!

He turns around to see the room decorated with a life-sized replica of Lebbeus Woods' copyrighted architectural sculpture "NEOPOLITAN TOWER".`,
  },
  {
    id: "cleared-masterpiece",
    title: "Fully Cleared Independent Production",
    genre: "Sci-Fi Drama (Greenlit)",
    description:
      "A fully cleared, production-ready scene utilizing fictionalized props, public domain audio, and Georgia production tax incentive optimization.",
    initialRiskUsd: 0,
    scriptText: `INT. SAVANNAH SOUNDSTAGE - STAGE 4 - DAY

LARA (30) sits before a bank of holographic telemetry monitors. On her wrist is a custom fictionalized CHRONOS-9 TACTICAL CHRONOMETER.

Soft orchestral ambient music (Public Domain / CC0) hums gently through the room.

LARA
(calmly)
Quantum sequence stabilized. All permits confirmed for Savannah riverfront filming.

She sips from a generic blue VOLTRUSH ENERGY canister and initiates the launch sequence.`,
  },
];

export const MOCK_EXTRACTED_ENTITIES: Record<string, ExtractedEntity[]> = {
  "scifi-nightmare": [
    {
      id: "ent-1",
      sceneNumber: 1,
      rawText: "vintage ROLEX SUBMARINER",
      category: "trademark",
      description: "Unlicensed prominent luxury trademark featured in hero shot.",
      status: "hazard",
      originalExposure: 650000,
      clearedExposure: 0,
      defusedText: "custom CHRONOS-9 tactile timepiece",
      citations: [
        {
          id: "cit-1",
          category: "trademark",
          title: "USPTO Serial #73124589 - ROLEX (Cl. 14 Horological)",
          sourceUrl: "https://uspto.gov/trademarks",
          snippet:
            "Active federal trademark registration. Rolex SA aggressively enforces against unapproved commercial product placement and fictional character association.",
          verified: true,
        },
        {
          id: "cit-2",
          category: "caselaw",
          title: "Rolex Watch U.S.A., Inc. v. Zeckendorf (Fed. Cir.)",
          sourceUrl: "https://casetext.com",
          snippet:
            "Unauthorized commercial prominence creates false endorsement liability under Lanham Act § 43(a).",
          verified: true,
        },
      ],
    },
    {
      id: "ent-2",
      sceneNumber: 1,
      rawText: "RUNNING UP THAT HILL by Kate Bush",
      category: "copyright",
      description: "Unlicensed master recording and sync rights for major pop anthem.",
      status: "hazard",
      originalExposure: 450000,
      clearedExposure: 0,
      defusedText: "original synth-wave ambient score by local composer",
      citations: [
        {
          id: "cit-3",
          category: "caselaw",
          title: "Campbell v. Acuff-Rose Music, 510 U.S. 569",
          sourceUrl: "https://supreme.justia.com",
          snippet:
            "Sync licenses for commercial narrative films require direct publisher and master recording clearance; background use is rarely excused as fair use.",
          verified: true,
        },
      ],
    },
    {
      id: "ent-3",
      sceneNumber: 1,
      rawText: "high-speed quadcopter tears across active traffic lanes",
      category: "permit",
      description:
        "FAA Part 107 night drone operations over unclosed municipal traffic on 6th St Viaduct.",
      status: "hazard",
      originalExposure: 1740000,
      clearedExposure: 0,
      defusedText: "Filmed at Savannah, GA private facility with 30% tax rebate",
      citations: [
        {
          id: "cit-4",
          category: "permit",
          title: "FilmLA Permit Ordinance 2026-B & FAA Part 107.39",
          sourceUrl: "https://filmla.com",
          snippet:
            "Operations over moving vehicles require 45-day advance Caltrans closure notice, CHP escort, and $5M commercial aviation liability rider.",
          verified: true,
        },
        {
          id: "cit-5",
          category: "tax",
          title: "Georgia Entertainment Industry Investment Act (O.C.G.A. § 48-7-40.26)",
          sourceUrl: "https://georgia.org/film",
          snippet:
            "Qualified production expenditures in Georgia receive a 20% base tax credit plus a 10% Georgia Entertainment Promotion uplift.",
          verified: true,
        },
      ],
    },
  ],
};
