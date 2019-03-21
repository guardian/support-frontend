const chalk = require('chalk');
const { writeFile } = require('fs');
const { Cluster } = require('puppeteer-cluster');
const { resolve } = require('path');
const os = require('os');

const pages = ['uk/support', 'uk/subscribe/paper'];

(async () => {

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: os.cpus().length || 2,
  });

  await cluster.task(async ({ page, data }) => {
    const { path } = data;
    console.log(`started  ${path}`);

    const url = `http://localhost:9211/${path}`;
    await page.setCookie({
      name: 'GU_TK',
      value: '1.0',
      domain: 'localhost',
      expires: Math.ceil(Date.now() / 1000) + 3600,
    });
    await page.goto(url);
    await page.waitFor('.gu-render-to > *');
    const bodyHTML = await page.evaluate(() => document.documentElement.querySelector('.gu-render-to').innerHTML);

    writeFile(
      resolve(__dirname, '..', 'conf/ssr-cache/', `${path.replace(/\//g, '-')}.html`),
      bodyHTML, 'utf8', (err) => {
        if (err) {
          throw err;
        }
        console.log(chalk.green(`done     ${path}`));
      },
    );
  });

  await Promise.all(pages.map(path => cluster.queue({ path })));
  await cluster.idle();
  await cluster.close();

})();
