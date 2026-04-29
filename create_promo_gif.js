/**
 * Majelan Promo GIF Creator
 * Showcases: Language Selection → Translation → Word Matching (hints) → Sentence Matching
 * Output: majelan_promo.gif
 * Usage: node create_promo_gif.js
 */

const puppeteer  = require('puppeteer');
const GIFEncoder = require('gif-encoder-2');
const { PNG }    = require('pngjs');
const fs         = require('fs');

// ── Config ──────────────────────────────────────────────────────────────────
const WIDTH       = 480;
const HEIGHT      = 300;
const FRAME_DELAY = 220;
const QUALITY     = 20;
const BASE        = 'https://majelan.org';
const OUTPUT      = 'majelan_promo.gif';

// ── Helpers ──────────────────────────────────────────────────────────────────
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function pngToPixels(buffer) {
  const png = PNG.sync.read(buffer);
  return new Uint8ClampedArray(png.data);
}

async function hold(page, frames, seconds) {
  const count = Math.max(1, Math.round((seconds * 1000) / FRAME_DELAY));
  const buf   = await page.screenshot({ type: 'png' });
  for (let i = 0; i < count; i++) frames.push(buf);
}

async function smoothScroll(page, frames, fromY, toY, steps = 15) {
  const delta = (toY - fromY) / steps;
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(fromY + delta * i));
    await wait(40);
    frames.push(await page.screenshot({ type: 'png' }));
  }
}

async function go(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await wait(1000);
}

/** Set a native <select> value and fire the change event the page listens to */
async function setSelect(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (el) { el.value = val; el.dispatchEvent(new Event('change')); }
  }, selector, value);
}

/** Safely click a selector, ignoring errors */
async function safeClick(page, selector) {
  try { await page.click(selector); } catch (_) {}
}

/** Hover a selector and hold for visual effect */
async function hoverHold(page, frames, selector, seconds = 1) {
  try { await page.hover(selector); } catch (_) {}
  await hold(page, frames, seconds);
}

// ── Section 1: Language Selection (/start) ───────────────────────────────────
async function sectionLanguageSelection(page, frames) {
  console.log('📸 [1/4] Language Selection…');
  await go(page, `${BASE}/start`);
  await hold(page, frames, 2);                      // show Step 1 grid
  await smoothScroll(page, frames, 0, 200, 12);     // scroll to see more language cards
  await hold(page, frames, 1.5);
  await smoothScroll(page, frames, 200, 0, 8);      // scroll back up

  // Click English (native language)
  await page.evaluate(() => {
    for (const card of document.querySelectorAll('#nativeLanguageGrid .language-card')) {
      if (card.querySelector('.card-title')?.textContent.trim() === 'English') {
        card.click(); break;
      }
    }
  });
  await hold(page, frames, 1.5);

  // Wait for Step 2 — target language grid
  try {
    await page.waitForSelector('#targetLanguageStep:not(.d-none)', { timeout: 5000 });
    await hold(page, frames, 2);
    await smoothScroll(page, frames, 0, 180, 10);
    await hold(page, frames, 1.5);

    // Click Amharic (target language)
    await page.evaluate(() => {
      for (const card of document.querySelectorAll('#targetLanguageGrid .language-card')) {
        if (card.querySelector('.card-title')?.textContent.trim() === 'Amharic') {
          card.click(); break;
        }
      }
    });
    await hold(page, frames, 1.5);
  } catch (_) {}

  // Wait for Step 3 — confirmation
  try {
    await page.waitForSelector('#confirmationStep:not(.d-none)', { timeout: 5000 });
    await hold(page, frames, 2.5);
  } catch (_) { await hold(page, frames, 2); }
}

// ── Section 2: Translation Mode (/translate) ──────────────────────────────────
async function sectionTranslation(page, frames) {
  console.log('📸 [2/4] Translation Mode…');
  await go(page, `${BASE}/translate`);
  await hold(page, frames, 1.5);

  // Select English → Amharic
  await setSelect(page, '#sourceLanguage', 'english');
  await wait(300);
  await setSelect(page, '#targetLanguage', 'amharic');
  await wait(1800);                                 // wait for categories to load
  await hold(page, frames, 1.5);

  // Pick first available category
  const cat = await page.evaluate(() => {
    const sel = document.getElementById('categorySelect');
    if (sel && !sel.disabled && sel.options.length > 1) {
      sel.selectedIndex = 1; return sel.value;
    }
    return null;
  });
  if (cat) { await setSelect(page, '#categorySelect', cat); await wait(800); }
  await hold(page, frames, 1);

  // Pick first available phrase
  const phrase = await page.evaluate(() => {
    const sel = document.getElementById('phraseSelect');
    if (sel && !sel.disabled && sel.options.length > 1) {
      sel.selectedIndex = 1; return sel.value;
    }
    return null;
  });
  if (phrase) { await setSelect(page, '#phraseSelect', phrase); await wait(1200); }

  // Show translation result
  try {
    await page.waitForSelector('#resultsSection', { visible: true, timeout: 6000 });
    await hold(page, frames, 2);
    await smoothScroll(page, frames, 0, 280, 12);
    await hold(page, frames, 2);
    await hoverHold(page, frames, '#speakBtn', 1.5); // hover the Play Audio button
  } catch (_) { await hold(page, frames, 2); }
}

// ── Section 3: Word Matching (/matching-game) ─────────────────────────────────
async function sectionWordMatching(page, frames) {
  console.log('📸 [3/4] Word Matching Game…');
  await go(page, `${BASE}/matching-game`);
  await hold(page, frames, 1.5);                   // show language selection form

  // Set English → Amharic
  await setSelect(page, '#nativeLanguage', 'english');
  await wait(200);
  await setSelect(page, '#targetLanguage', 'amharic');
  await wait(2000);                                // wait for categories API
  await hold(page, frames, 1);

  // Select first available category
  const cat = await page.evaluate(() => {
    const sel = document.getElementById('categorySelect');
    if (sel && !sel.disabled && sel.options.length > 1) {
      sel.selectedIndex = 1; return sel.value;
    }
    return null;
  });
  if (cat) { await setSelect(page, '#categorySelect', cat); await wait(300); }

  // 5 words — small enough for a clean visual
  await setSelect(page, '#wordCount', '5');
  await hold(page, frames, 1);

  // Start the game
  await safeClick(page, '#startGame');
  await wait(2500);                                // wait for API + render

  try {
    await page.waitForSelector('#gameBoard', { visible: true, timeout: 8000 });
    await hold(page, frames, 2.5);                // show the word pairs in two columns

    // Click "Show Hints" → orange dashed arrows connect matching pairs
    await safeClick(page, '#hintBtn');
    await wait(600);
    await hold(page, frames, 2.5);                // show hint arrows

    // Click "Hide Hints"
    await safeClick(page, '#hintBtn');
    await wait(400);
    await hold(page, frames, 1.5);
  } catch (_) { await hold(page, frames, 3); }
}

// ── Section 4: Sentence Matching (/conversation-game) ─────────────────────────
async function sectionSentenceMatching(page, frames) {
  console.log('📸 [4/4] Sentence Matching Game…');
  await go(page, `${BASE}/conversation-game`);
  await hold(page, frames, 1.5);

  // Use 'airport' — has full stage/exchange data unlike restaurant
  await setSelect(page, '#contextSelect', 'airport');
  await wait(200);
  await setSelect(page, '#nativeLanguageSelect', 'english');
  await wait(200);
  await setSelect(page, '#targetLanguageSelect', 'amharic');
  await wait(200);
  await hold(page, frames, 1);

  // Start the game
  await safeClick(page, '#startGameBtn');
  await wait(4000);                                // extra time for conversation API

  try {
    await page.waitForSelector('#gameBoard', { visible: true, timeout: 12000 });
    await wait(500);
    await hold(page, frames, 2);

    // Click the first sentence to open its translation dropdown
    const firstSentence = await page.$('.conversation-item');
    if (firstSentence) {
      await firstSentence.click();
      await wait(800);
      await hold(page, frames, 2);                // show dropdown with shuffled options

      // Click the first dropdown item (simulates making a choice)
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-item');
        if (items.length > 0) items[0].click();
      });
      await wait(800);
      await hold(page, frames, 2);                // show correct/wrong feedback
    }

    await smoothScroll(page, frames, 0, 180, 10);
    await hold(page, frames, 1.5);
  } catch (err) {
    console.log(`  ⚠️  Sentence matching skipped: ${err.message}`);
    const buf = await page.screenshot({ type: 'png' }).catch(() => null);
    if (buf) for (let i = 0; i < 5; i++) frames.push(buf);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Launching browser…');
  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 120000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  // Auto-dismiss any alert/confirm/prompt dialogs so they never block screenshots
  page.on('dialog', async (dialog) => { try { await dialog.dismiss(); } catch (_) {} });
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const frames = [];
  await sectionLanguageSelection(page, frames);
  await sectionTranslation(page, frames);
  await sectionWordMatching(page, frames);
  await sectionSentenceMatching(page, frames);
  await browser.close();
  console.log(`✅ Captured ${frames.length} frames`);

  // Encode GIF
  console.log('🎞️  Encoding GIF… (this may take a few minutes)');
  const encoder = new GIFEncoder(WIDTH, HEIGHT, 'neuquant', true);
  encoder.setDelay(FRAME_DELAY);
  encoder.setRepeat(0);
  encoder.setQuality(QUALITY);
  encoder.start();

  for (let i = 0; i < frames.length; i++) {
    if (i % 20 === 0)
      process.stdout.write(`\r   Processing frame ${i + 1} / ${frames.length}…`);
    encoder.addFrame(pngToPixels(frames[i]));
  }

  encoder.finish();
  const gifBuffer = encoder.out.getData();
  fs.writeFileSync(OUTPUT, gifBuffer);

  const sizeMB = (gifBuffer.length / 1024 / 1024).toFixed(1);
  console.log(`\n🎉 Done!  →  ${OUTPUT}  (${frames.length} frames, ${sizeMB} MB)`);
  if (parseFloat(sizeMB) > 8)
    console.log('⚠️  Over 8 MB — raise QUALITY value or shorten sections.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});


