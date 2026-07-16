import { chromium, type Browser } from "playwright";

let browser: Browser | null = null;

function getHeadlessValue() {
  return process.env.PLAYWRIGHT_HEADLESS === "true";
}

function getSlowMoValue() {
  return Number(process.env.PLAYWRIGHT_SLOW_MO ?? 300);
}

function getBrowserLocale() {
  return process.env.PLAYWRIGHT_LOCALE ?? "pt-BR";
}

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: getHeadlessValue(),
      slowMo: getSlowMoValue(),
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        `--lang=${getBrowserLocale()}`,
      ],
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