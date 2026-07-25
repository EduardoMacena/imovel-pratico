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

function getBrowserChannel() {
  return process.env.PLAYWRIGHT_CHANNEL?.trim() || undefined;
}

function getExecutablePath() {
  return process.env.PLAYWRIGHT_EXECUTABLE_PATH?.trim() || undefined;
}

function getDefaultArgs() {
  const locale = getBrowserLocale();

  if (process.platform === "win32") {
    return [`--lang=${locale}`];
  }

  return ["--no-sandbox", "--disable-dev-shm-usage", `--lang=${locale}`];
}

function getExtraArgs() {
  const raw = process.env.PLAYWRIGHT_EXTRA_ARGS?.trim();

  if (!raw) {
    return [];
  }

  return raw
    .split(" ")
    .map(arg => arg.trim())
    .filter(Boolean);
}

export async function getBrowser() {
  if (!browser) {
    const channel = getBrowserChannel();
    const executablePath = getExecutablePath();

    browser = await chromium.launch({
      channel,
      executablePath,
      headless: getHeadlessValue(),
      slowMo: getSlowMoValue(),
      args: [...getDefaultArgs(), ...getExtraArgs()],
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
