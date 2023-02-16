import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.in/s?k=gaming+laptop+under+60000&qid=1676473936&sprefix=gaming+lap%2Caps%2C318&ref=sr_pg_1"
  );
  const list = await page.$$(
    ".s-card-container.s-overflow-hidden.aok-relative.puis-include-content-margin.puis.s-latency-cf-section.s-card-border>div>div"
  );
  const items = list.map(async (item, index) => {
    const title = await page.evaluate(
      (el) =>
        el.querySelector(
          ".a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style>h2>a>span"
        )?.innerHTML,
      item
    );
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
    return { index, title, price, rating };
  });
  const result = await Promise.all(items);
  console.log(result);
})();
