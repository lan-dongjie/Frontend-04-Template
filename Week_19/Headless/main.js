const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:9000/index.html');
//   await page.screenshot({path: 'example.png'});
  const a = await page.$('a');
  const box = await a.asElement().boxModel()
console.log(box);
  await browser.close();
})();