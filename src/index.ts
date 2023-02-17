import puppeteer from "puppeteer";
import fs from "fs";
(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto("https://www.amazon.in/");
  await page.waitForSelector("#twotabsearchtextbox");
  await page.type("#twotabsearchtextbox", "iphone 14");
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
  const result = await Promise.all(items);
  fs.writeFileSync("./out/result.json", JSON.stringify(result));
  fs.writeFileSync(
    "./out/result.csv",
    result
      .map((item) => {
        return `${item.index},${item.title},${item.price},${item.rating},${item.link}`;
      })
      .join("\n")
  );
  await browser.close();
})();
