const puppeteer = require("puppeteer");

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = "https://daily.slickdeals.net/shopping/costco-coupon-book/";

  await page.goto(url);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Extract the links for images of the current costco coupons
  const linkHrefs = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("figure.wp-block-image a");
    const firstImage = document.querySelector("figure.aligncenter.size-full a");
    const linkHrefArray = [];
    if(firstImage.href.includes("Costco-Coupon-page")) {
        linkHrefArray.push(firstImage.href);
      }
    nodeList.forEach((node) => {
      if(node.href.includes("Costco-Coupon-page")) {
        linkHrefArray.push(node.href);
      }
    });
    return linkHrefArray;
  });

  console.log(linkHrefs);

  // Save each image to a file
    // for (let i = 0; i < linkHrefs.length; i++) {    
    // await page.goto(linkHrefs[i]);
    // await page.waitForSelector("img");
    // const imageSrc = await page.evaluate(() => {
    //     const img = document.querySelector("img");
    //     return img.src;
    //     }
    // );
    // console.log(imageSrc);
    // await page.goto(imageSrc);
    // await page.waitForSelector("img");
    // await page.screenshot({ path: `./images/costco-coupon-${i}.png` });
    // }








})().catch((e) => {
  console.error(e);
  process.exit(1);
});
