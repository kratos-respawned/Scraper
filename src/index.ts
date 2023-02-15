import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.in/s?k=gaming+laptop+under+60000&qid=1676473936&sprefix=gaming+lap%2Caps%2C318&ref=sr_pg_1"
  );
  const items = await page.$$(
    ".sg-col-20-of-24 .s-result-item .s-asin .sg-col-0-of-12 .sg-col-16-of-20 .sg-col .s-widget-spacing-small .sg-col-12-of-16"
  );
  console.log(items);
})();
