const puppeteer = require('puppeteer');
const { writeFile } = require('fs');

const pages = ['uk/support', 'uk/subscribe/paper'];

const pg = pages[1];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `http://localhost:9211/${pg}`;
  page.goto(url);
  await page.setCookie({
    name: 'GU_TK',
    value: '1.1553079258164',
    domain: 'localhost',
  });

  await page.waitFor('.gu-render-to > *');
  const bodyHTML = await page.evaluate(() => document.documentElement.querySelector('.gu-render-to').innerHTML);

  writeFile(`${__dirname}/../conf/ssr-cache/${pg.replace(/\//g, '-')}.html`, bodyHTML, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.info(`Wrote ${pg}`);
  });
})();
