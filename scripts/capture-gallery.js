const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const GALLERY_DIR = path.resolve("gallery");

if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

async function captureGallery() {
  console.log("Launching Microsoft Edge for 3:2 Devpost Gallery screenshots...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--window-size=1440,960"],
  });

  const page = await browser.newPage();
  // 1440 x 960 is exactly 3:2 aspect ratio, optimized for Devpost gallery
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Initial Studio Dashboard Overview
  const img1 = path.join(GALLERY_DIR, "01_deepclear_studio_hero.png");
  await page.screenshot({ path: img1 });
  console.log("Captured:", img1);

  // 2. Click 'Cleared Masterpiece' preset (instant certification & safe harbor)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const masterBtn = btns.find((b) => b.textContent && b.textContent.includes("Cleared Masterpiece"));
    if (masterBtn) masterBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  const img2 = path.join(GALLERY_DIR, "02_safe_harbor_certified_swarm.png");
  await page.screenshot({ path: img2 });
  console.log("Captured:", img2);

  // 3. Open Parallel Grounding Inspector Drawer
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const inspectorBtn = btns.find((b) => b.textContent && b.textContent.includes("Parallel Inspector") || b.textContent.includes("Inspector"));
    if (inspectorBtn) inspectorBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  const img3 = path.join(GALLERY_DIR, "03_parallel_grounding_inspector.png");
  await page.screenshot({ path: img3 });
  console.log("Captured:", img3);

  // Close Inspector using Escape key
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 1000));

  // 4. Switch to Screenplay Redline Diff View
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const redlineBtn = btns.find((b) => b.textContent && b.textContent.includes("Redline"));
    if (redlineBtn) redlineBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  const img4 = path.join(GALLERY_DIR, "04_screenplay_redline_diff.png");
  await page.screenshot({ path: img4 });
  console.log("Captured:", img4);

  // 5. Open Distribution Clearance & Export Modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const exportBtn = btns.find((b) => b.textContent && b.textContent.includes("Export"));
    if (exportBtn) exportBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  const img5 = path.join(GALLERY_DIR, "05_eo_underwriting_export_binder.png");
  await page.screenshot({ path: img5 });
  console.log("Captured:", img5);

  // Close Export Modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.includes("Cancel"));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 6. Tablet Viewport (1024 x 682, 3:2 ratio)
  await page.setViewport({ width: 1024, height: 682, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 1000));
  const img6 = path.join(GALLERY_DIR, "06_tablet_redline_viewport.png");
  await page.screenshot({ path: img6 });
  console.log("Captured:", img6);

  await browser.close();
  console.log("Gallery capture complete! 6 high-res 3:2 images saved to /gallery");
}

captureGallery().catch((err) => {
  console.error("Gallery capture error:", err);
  process.exit(1);
});
