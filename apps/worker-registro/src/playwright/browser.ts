import { chromium, type Browser } from "playwright";

let browser: Browser | null = null;

function getHeadlessValue() {
  return process.env.PLAYWRIGHT_HEADLESS === "true";
}

function getSlowMoValue() {
  return Number(process.env.PLAYWRIGHT_SLOW_MO ?? 300);
}

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: getHeadlessValue(),
      slowMo: getSlowMoValue(),
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  }

  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
