import puppeteer, { Browser, Page } from 'puppeteer';

export async function performGetRequest(browser: Browser, url: string, timeout: number) {
  // const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await configurePage(page);
  let res;
  try {
    res = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: timeout,
    });

  } finally {
    page.close()
  }
  return res
}

async function configurePage(page: Page): Promise<void> {
  // Set the user agent to look like a regular browser
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
  await page.setJavaScriptEnabled(true)
  await page.setUserAgent(userAgent);

  // Set the viewport to emulate a regular browser screen size
  await page.setViewport({ width: 1280, height: 800 });
}

// (async () => {
//   const url = 'https://example.com';
//   const timeout = 7500; // 7.5 seconds
//   await performGetRequest(url, timeout);
// })();