/**
 * DeepClear Studio — Automated Full-Feature 3-Minute Trailer Recording Script
 * 
 * Choreographs the complete studio feature suite in ~2:50:
 * 1. Studio Dashboard & Agent Tagging (@legal_counsel) with dynamic Listening thought card
 * 2. Scene Ingestion with Google Cloud Gemini Flash (Southern Gothic preset) & Statutory Exposure HUD
 * 3. 5-Agent Swarm Autonomous Dialectic Debate with multi-voice speech
 * 4. Official Parallel Web Systems SDK Grounding (~42ms latency telemetry card)
 * 5. Parallel Grounding Inspector Drawer (Telemetry & All Dossier)
 * 6. Screenplay Redline Diff Engine (Side-by-side split & stutter defense)
 * 7. Human-in-the-Loop Producer Dispute & Script Rollback
 * 8. Cryptographic Clearance Passport Ingestion (Merkle Root & Confetti)
 * 9. Form E&O-2026 Executive PDF Underwriting Binder Preview & Scroll
 */

const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_VIDEO = path.resolve('deepclear_studio_demo.mp4');

async function recordFullDemo() {
  console.log('====================================================');
  console.log('🎬 DEEPCLEAR STUDIO: 3-MINUTE TRAILER RECORDER');
  console.log('====================================================');

  if (fs.existsSync(OUTPUT_VIDEO)) {
    try { fs.unlinkSync(OUTPUT_VIDEO); } catch {}
  }

  // Launch FFmpeg process to receive JPEG frames via stdin
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    OUTPUT_VIDEO
  ]);

  ffmpeg.stderr.on('data', () => {});

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-notifications',
      '--no-default-browser-check',
      '--disable-infobars',
      '--disable-extensions',
      '--hide-scrollbars',
      '--window-size=1920,1080'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  console.log('Navigating to DeepClear Studio on localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

  // Start Screencast at 30fps
  const client = await page.target().createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    everyNthFrame: 1
  });

  let frameCount = 0;
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    frameCount++;
    ffmpeg.stdin.write(Buffer.from(data, 'base64'));
    try {
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch {}
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    // -------------------------------------------------------------
    // ACT 1: HERO OVERVIEW & @ MENTION TAGGING WITH LISTENING STATE (0:00 - 0:25)
    // -------------------------------------------------------------
    console.log('[0:00] Act 1: Displaying Studio Command Center...');
    await sleep(4000);

    console.log('[0:05] Demonstrating @ Mention Tagging in Prompt Bar...');
    const textarea = await page.waitForSelector('textarea');
    await textarea.click();

    // Type tag with deliberate cadence to demonstrate the live listening state
    await page.keyboard.type('@legal_counsel', { delay: 70 });
    await sleep(1200);
    await page.keyboard.type(' what are the statutory liabilities for using real brand names in dialogue?', { delay: 45 });
    await sleep(4000);

    // Clear input to transition to screenplay demo
    await page.evaluate(() => {
      const el = document.querySelector('textarea');
      if (el) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(el, '');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await sleep(2000);

    // -------------------------------------------------------------
    // ACT 2: GEMINI INGESTION & SOUTHERN GOTHIC PRESET (0:25 - 0:55)
    // -------------------------------------------------------------
    console.log('[0:25] Act 2: Triggering Southern Gothic Preset (Gemini Multimodal Vision)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const gothicBtn = buttons.find(b => b.innerText && b.innerText.includes('Southern Gothic'));
      if (gothicBtn) gothicBtn.click();
    });

    console.log('[0:30] Ingesting draft, isolating liabilities & calculating E&O exposure...');
    await sleep(15000);

    // -------------------------------------------------------------
    // ACT 3: 5-AGENT WAR ROOM & PARALLEL SDK GROUNDING (0:55 - 1:40)
    // -------------------------------------------------------------
    console.log('[0:55] Act 3: Autonomous Swarm Debate executing with Parallel Grounding...');
    // Allow the multi-agent debate to progress and resolve liabilities
    await sleep(35000);

    // -------------------------------------------------------------
    // ACT 4: PARALLEL GROUNDING INSPECTOR DRAWER (1:40 - 2:05)
    // -------------------------------------------------------------
    console.log('[1:40] Act 4: Opening Parallel Grounding Inspector Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const inspBtn = buttons.find(b => b.innerText && b.innerText.includes('Parallel Inspector'));
      if (inspBtn) inspBtn.click();
    });
    await sleep(8000);

    console.log('[1:50] Toggling to All Grounding Dossier tab in Inspector...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const dossierTab = tabs.find(t => t.innerText && (t.innerText.includes('All Grounding Dossier') || t.innerText.includes('Dossier')));
      if (dossierTab) dossierTab.click();
    });
    await sleep(9000);

    console.log('[2:00] Closing Parallel Inspector Drawer...');
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const closeBtn = closeButtons.find(b => b.getAttribute('title')?.includes('Close') || b.innerText === 'Close' || b.innerHTML.includes('lucide-x'));
      if (closeBtn) closeBtn.click();
    });
    await sleep(3000);

    // -------------------------------------------------------------
    // ACT 5: SCREENPLAY REDLINE DIFF VIEW (2:05 - 2:25)
    // -------------------------------------------------------------
    console.log('[2:05] Act 5: Switching to Screenplay Redline Diff View...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const redlineTab = buttons.find(b => b.innerText && b.innerText.includes('Screenplay Redline'));
      if (redlineTab) redlineTab.click();
    });
    await sleep(8000);

    // Smoothly scroll down the redline diff to show side-by-side mutations
    await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('div'));
      const scrollable = containers.find(c => c.scrollHeight > c.clientHeight && c.scrollHeight > 500);
      if (scrollable) {
        scrollable.scrollBy({ top: 350, behavior: 'smooth' });
      }
    });
    await sleep(8000);

    // Switch back to Swarm Debate tab
    console.log('[2:20] Returning to Swarm Debate View...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const debateTab = buttons.find(b => b.innerText && (b.innerText.includes('Swarm Debate') || b.innerText.includes('Debate')));
      if (debateTab) debateTab.click();
    });
    await sleep(4000);

    // -------------------------------------------------------------
    // ACT 6: PRODUCER DISPUTE & SCRIPT ROLLBACK (2:25 - 2:40)
    // -------------------------------------------------------------
    console.log('[2:25] Act 6: Clicking [ Dispute ] to demonstrate Human-in-the-Loop Rollback...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const disputeBtn = buttons.find(b => b.innerText && b.innerText.includes('Dispute'));
      if (disputeBtn) disputeBtn.click();
    });
    await sleep(9000);

    // -------------------------------------------------------------
    // ACT 7: CLEARANCE PASSPORT & FORM E&O-2026 PDF EXPORT (2:40 - 2:55)
    // -------------------------------------------------------------
    console.log('[2:35] Act 7: Loading Cleared Masterpiece (Cryptographic Passport Bypass)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const masterBtn = buttons.find(b => b.innerText && b.innerText.includes('Cleared Masterpiece'));
      if (masterBtn) masterBtn.click();
    });
    await sleep(9000);

    console.log('[2:45] Opening Form E&O-2026 PDF Export Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exportBtn = buttons.find(b => b.innerText && b.innerText.includes('Export Form E&O-2026'));
      if (exportBtn) exportBtn.click();
    });
    await sleep(5000);

    console.log('[2:50] Smoothly scrolling through Form E&O-2026 Document Preview to Exhibit B...');
    await page.evaluate(() => {
      const modalScroll = document.querySelector('.max-h-\\[92vh\\], .overflow-y-auto');
      if (modalScroll) {
        modalScroll.scrollBy({ top: 500, behavior: 'smooth' });
      }
    });
    await sleep(8000);

    console.log('[2:55] Closing Export Modal to conclude cleanly on Studio Command Center...');
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const closeBtn = closeButtons.find(b => b.innerText && (b.innerText.includes('Cancel') || b.innerText.includes('Close') || b.innerText.includes('Done')));
      if (closeBtn) closeBtn.click();
    });
    await sleep(3000);

    console.log('✅ 3-Minute Demo Choreography successfully completed!');
  } catch (err) {
    console.error('Error during demo choreography:', err);
  } finally {
    console.log('Stopping screencast and finalizing MP4 with FFmpeg...');
    try {
      await client.send('Page.stopScreencast');
      await browser.close();
    } catch {}

    ffmpeg.stdin.end();
    await new Promise((r) => ffmpeg.on('close', r));

    if (fs.existsSync(OUTPUT_VIDEO)) {
      const stats = fs.statSync(OUTPUT_VIDEO);
      console.log(`🎉 VIDEO CREATED SUCCESSFULLY: ${OUTPUT_VIDEO}`);
      console.log(`📊 Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB | Frames: ${frameCount}`);
    } else {
      console.error('Video file was not created.');
    }
  }
}

recordFullDemo().catch(console.error);
