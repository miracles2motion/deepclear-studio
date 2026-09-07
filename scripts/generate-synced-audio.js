/**
 * Generate synchronized voiceover audio for deepclear_studio_demo.mp4
 * 
 * Act timings on the 98-second video:
 * - Act 1: 0s  (Tagging @legal_counsel & listening thought card)
 * - Act 2: 15s (Southern Gothic scene ingestion & E&O liability HUD)
 * - Act 3: 35s (5-Agent dialectics & Parallel SDK ~42ms telemetry card)
 * - Act 4: 58s (Parallel Grounding Inspector Drawer & All Dossier)
 * - Act 5: 72s (Screenplay Redline Diff side-by-side view)
 * - Act 6: 84s (Producer Dispute & statutory exposure rollback)
 * - Act 7: 90s (Clearance Passport bypass & Form E&O-2026 PDF scroll)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clips = [
  {
    id: 'act1',
    startSec: 0,
    text: "Before any film or series can stream on Netflix, Apple TV, or festival premieres, distributors require an E and O insurance policy and a clean Chain of Title. DeepClear Studio is an autonomous clearance co-pilot. Notice our crew swarm: typing legal counsel tags our attorney and activates their live listening state."
  },
  {
    id: 'act2',
    startSec: 15,
    text: "Clicking Southern Gothic loads a scene. In under two seconds, Google Cloud Gemini Flash isolates five statutory liabilities: unauthorized trademarks, unpermitted parks, and music sync cues, totaling 525,000 dollars in exposure while unlocking 157,500 dollars in Georgia tax credits."
  },
  {
    id: 'act3',
    startSec: 35,
    text: "In Auto-Pilot mode, our five agents negotiate autonomously. To resolve trademark liabilities, DeepClear connects to the official Parallel Web Systems SDK. Parallel validates that our proposed substitute prop has zero commercial conflicts in just 42 milliseconds."
  },
  {
    id: 'act4',
    startSec: 58,
    text: "Opening the Parallel Inspector reveals transparent search telemetry and international classes across all screenplay assets in the All Grounding Dossier."
  },
  {
    id: 'act5',
    startSec: 72,
    text: "Switching to the Screenplay Redline shows the original draft versus the cleared production script with built-in Stutter Defense."
  },
  {
    id: 'act6',
    startSec: 84,
    text: "Filmmakers keep control: clicking Dispute rolls back safe harbor, restoring exposure and reverting the script."
  },
  {
    id: 'act7',
    startSec: 90,
    text: "Finally, DeepClear embeds a cryptographic Clearance Passport and exports Form E and O 2026 with Exhibit B: Parallel Audit Ledger."
  }
];

const scratchDir = path.resolve('scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

console.log('Synthesizing 7 timed narration clips...');

clips.forEach((clip, index) => {
  const wavPath = path.join(scratchDir, `${clip.id}.wav`);
  const escapedText = clip.text.replace(/'/g, "''").replace(/"/g, '`"');
  
  const psCmd = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = 1 # Slightly brisk conversational cadence
$s.SetOutputToWaveFile('${wavPath.replace(/\\/g, '\\\\')}')
$s.Speak("${escapedText}")
$s.Dispose()
`;
  fs.writeFileSync(path.join(scratchDir, `gen_${clip.id}.ps1`), psCmd);
  execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(scratchDir, `gen_${clip.id}.ps1`)}"`);
  console.log(`Generated clip ${index + 1}/7: ${clip.id}.wav`);
});

// Construct FFmpeg complex filter to delay each clip to its exact timestamp and mix them
console.log('Mixing timed audio clips into master voiceover...');

let inputs = '';
let filter = '';
clips.forEach((c, idx) => {
  inputs += ` -i "${path.join(scratchDir, `${c.id}.wav`)}"`;
  const delayMs = Math.round(c.startSec * 1000);
  filter += `[${idx}:a]adelay=${delayMs}|${delayMs}[a${idx}];`;
});

const mixedInputs = clips.map((_, idx) => `[a${idx}]`).join('');
filter += `${mixedInputs}amix=inputs=${clips.length}:duration=longest:dropout_transition=0[outa]`;

const masterAudioPath = path.join(scratchDir, 'master_narration.wav');
execSync(`ffmpeg -y ${inputs} -filter_complex "${filter}" -map "[outa]" -c:a pcm_s16le "${masterAudioPath}"`);

console.log('Master narration track created at:', masterAudioPath);

// Merge master narration with deepclear_studio_demo.mp4 into deepclear_final_submission.mp4
const videoInput = path.resolve('deepclear_studio_demo.mp4');
const finalOutput = path.resolve('deepclear_final_submission.mp4');

console.log('Merging video and master voiceover track into deepclear_final_submission.mp4...');
execSync(`ffmpeg -y -i "${videoInput}" -i "${masterAudioPath}" -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 -shortest "${finalOutput}"`);

console.log('====================================================');
console.log('🎉 MERGED VIDEO READY: ' + finalOutput);
console.log('====================================================');
