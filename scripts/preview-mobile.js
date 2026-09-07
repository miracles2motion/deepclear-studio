const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = path.resolve("C:\\Users\\dd\\.gemini\\antigravity-ide\\brain\\a53f176e-6ea9-4dcf-a22c-fcf871e9bc65");

async function runMobileAudit() {
  console.log("Launching Microsoft Edge from:", EDGE_PATH);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // 1. Mobile Phone (iPhone 14: 390x844)
  console.log("Setting viewport to iPhone 14 (390x844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 3500));

  // Capture 1: Main Mobile Chat & Presets Screen
  const shot1 = path.join(ARTIFACT_DIR, "mobile_01_chat.png");
  await page.screenshot({ path: shot1, fullPage: false });
  console.log("Captured:", shot1);

  // Capture 2: Click 'Crew' tab in top nav
  const crewButtons = await page.$$("header button");
  for (const btn of crewButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes("Crew")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  const shot2 = path.join(ARTIFACT_DIR, "mobile_02_crew.png");
  await page.screenshot({ path: shot2, fullPage: false });
  console.log("Captured:", shot2);

  // Capture 3: Click 'Risk' tab in top nav
  for (const btn of crewButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes("Risk")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  const shot3 = path.join(ARTIFACT_DIR, "mobile_03_risk.png");
  await page.screenshot({ path: shot3, fullPage: false });
  console.log("Captured:", shot3);

  // Return to Chat tab
  for (const btn of crewButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes("Chat")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Capture 4: Click Screenplay Redline button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const target = btns.find((b) => b.textContent && b.textContent.includes("Redline"));
    if (target) target.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  const shot4 = path.join(ARTIFACT_DIR, "mobile_04_redline.png");
  await page.screenshot({ path: shot4, fullPage: false });
  console.log("Captured:", shot4);

  // 2. Interactive Mobile Test: Switch back to Debate view and load Cleared Masterpiece preset
  console.log("Switching to Debate tab and loading Cleared Masterpiece preset on mobile...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const debateBtn = btns.find((b) => b.textContent && b.textContent.includes("Debate"));
    if (debateBtn) debateBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const masterBtn = btns.find((b) => b.textContent && b.textContent.includes("Cleared Masterpiece"));
    if (masterBtn) masterBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Capture 5: Mobile active debate with safe harbor card & passport
  const shot5 = path.join(ARTIFACT_DIR, "mobile_05_active_debate.png");
  await page.screenshot({ path: shot5, fullPage: false });
  console.log("Captured:", shot5);

  // Capture 6: Open Parallel Inspector Drawer or entity verification on mobile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const inspectorBtn = btns.find((b) => b.textContent && b.textContent.includes("Inspector"));
    if (inspectorBtn && !inspectorBtn.disabled) {
      inspectorBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  const shot6 = path.join(ARTIFACT_DIR, "mobile_06_parallel_inspector.png");
  await page.screenshot({ path: shot6, fullPage: false });
  console.log("Captured:", shot6);

  // Close inspector
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const closeBtn = btns.find((b) => b.textContent && b.textContent.includes("Close") || b.getAttribute("aria-label") === "Close");
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Capture 7: Open Export Modal on mobile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const exportBtn = btns.find((b) => b.textContent && b.textContent.includes("Export"));
    if (exportBtn) exportBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  const shot7 = path.join(ARTIFACT_DIR, "mobile_07_export_modal.png");
  await page.screenshot({ path: shot7, fullPage: false });
  console.log("Captured:", shot7);

  // Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.includes("Cancel"));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 3. Tablet Viewport (iPad: 768x1024)
  console.log("Setting viewport to iPad (768x1024)...");
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await new Promise((r) => setTimeout(r, 1000));
  const shotTablet1 = path.join(ARTIFACT_DIR, "tablet_01_redline.png");
  await page.screenshot({ path: shotTablet1, fullPage: false });
  console.log("Captured:", shotTablet1);

  // Switch back to Chat view on tablet
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const target = btns.find((b) => b.textContent && b.textContent.includes("Debate"));
    if (target) target.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  const shotTablet2 = path.join(ARTIFACT_DIR, "tablet_02_chat.png");
  await page.screenshot({ path: shotTablet2, fullPage: false });
  console.log("Captured:", shotTablet2);

  // 4. Small Mobile Viewport (iPhone SE: 375x667)
  console.log("Setting viewport to iPhone SE (375x667)...");
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await new Promise((r) => setTimeout(r, 1000));
  const shotSE = path.join(ARTIFACT_DIR, "mobile_08_iphone_se.png");
  await page.screenshot({ path: shotSE, fullPage: false });
  console.log("Captured:", shotSE);

  await browser.close();
  console.log("Mobile & Tablet audit screenshots complete!");
}

runMobileAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
