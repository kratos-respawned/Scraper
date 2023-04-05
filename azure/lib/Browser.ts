import Chromium from "chrome-aws-lambda";
import puppeteer, { Browser } from "puppeteer";
type T = {
  index: number;
  title: string;
  price: string;
  rating: string;
  link: string;
}[];
export async function run(prompt: any): Promise<T> {
  const executablePath = await Chromium.executablePath;
  let browser: Browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://www.amazon.in/");
    await page.waitForSelector("#twotabsearchtextbox");
    await page.type("#twotabsearchtextbox", prompt);
    await page.click("#nav-search-submit-button");
    await page.waitForSelector(
      ".s-card-container.s-overflow-hidden.aok-relative.puis-include-content-margin.puis.s-latency-cf-section.s-card-border>div>div"
    );
    const list = await page.$$(
      ".s-card-container.s-overflow-hidden.aok-relative.puis-include-content-margin.puis.s-latency-cf-section.s-card-border>div>div"
    );

    const items = list.map(async (item, index) => {
      let title = await page.evaluate(
        (el) =>
          el.querySelector(
            ".a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style>h2>a>span"
          )?.innerHTML,
        item
      );
      let link = await page.evaluate(
        (el) =>
          el
            .querySelector(
              ".a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style>h2>a"
            )
            ?.getAttribute("href"),
        item
      );
      link = `https://www.amazon.in${link}`;
      const price = await page.evaluate(
        (el) =>
          el.querySelector(
            ".a-section.a-spacing-small.a-spacing-top-small .a-section.a-spacing-none.a-spacing-top-micro.s-price-instructions-style .a-size-base.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal span.a-offscreen"
          )?.innerHTML,
        item
      );
      const rating = await page.evaluate(
        (el) =>
          el.querySelector(
            ".a-section.a-spacing-small.a-spacing-top-small .a-section.a-spacing-none.a-spacing-top-micro span.a-size-base"
          )?.innerHTML,
        item
      );
      title = title?.replace(/\,/, "|");
      return { index, title, price, rating, link };
    });

    try {
      const result = await Promise.all(items);
      return result;
    } catch (e) {
      return null;
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
