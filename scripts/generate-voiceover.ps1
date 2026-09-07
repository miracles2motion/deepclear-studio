Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Select an English voice
$voices = $synth.GetInstalledVoices() | Where-Object { $_.Enabled }
Write-Host "Available voices:"
foreach ($v in $voices) {
    Write-Host " - $($v.VoiceInfo.Name) ($($v.VoiceInfo.Culture))"
}

# Set output path
$outputPath = Join-Path (Get-Location) "scratch\studio_voiceover.wav"
if (Test-Path $outputPath) {
    Remove-Item $outputPath -Force
}

$synth.SetOutputToWaveFile($outputPath)
$synth.Rate = 0  # Normal conversational speed

# Script segments aligned with video timestamps
$narration = @"
Before any film or series can stream on Netflix, Apple TV+, or premiere at Cannes, distributors demand an Errors and Omissions insurance policy and a clean Chain of Title. 
Today, entertainment lawyers charge 800 dollars an hour and take weeks to clear scripts. 
I built DeepClear Studio, an autonomous film clearance and E and O underwriting co-pilot. 
Notice our multi-agent crew: typing legal counsel immediately tags our attorney, dynamically highlighting the tag and activating their live listening state.

Clicking our Southern Gothic preset loads a dramatic scene. In under two seconds, Google Cloud Gemini Flash ingests the draft and isolates five statutory liabilities: unauthorized trademarks, unpermitted park locations, and music sync cues. 
Our E and O HUD immediately calculates our exposure: 525,000 dollars in statutory liability, putting distribution on HOLD, but also unlocking 157,500 dollars in Georgia film tax credits.

In Auto-Pilot mode, our five agents negotiate autonomously. To resolve trademark liabilities, DeepClear connects directly to the official Parallel Web Systems TypeScript SDK. 
Parallel executes live USPTO registry searches in just 42 milliseconds, certifying that our proposed substitute prop has zero conflicting commercial registrations.

Clicking the Parallel Inspector opens our transparent telemetry drawer, allowing production attorneys to inspect exact search IDs, query formulations, and USPTO international classes across all screenplay assets in the All Grounding Dossier.

Switching to the Screenplay Redline view, filmmakers see a side-by-side comparison of the original draft versus the cleared production script, complete with our built-in Screenplay Stutter Defense which sanitizes duplicate word collisions.

Human filmmakers always retain final control. Clicking Dispute immediately rolls back safe harbor, restores exposure, and reverts the script to the authentic prop for re-negotiation.

Finally, DeepClear embeds a cryptographic Clearance Passport into exported scripts, eliminating AI amnesia. 
With one click, we export an official Form E and O 2026 Insurance Underwriting Binder featuring Exhibit B: Parallel Web Systems Audit Ledger. 
DeepClear Studio turns a six-week legal ordeal into an autonomous 90-second workflow.
"@

Write-Host "Synthesizing full voiceover narration..."
$synth.Speak($narration)
$synth.Dispose()

Write-Host "Voiceover successfully generated at: $outputPath"
