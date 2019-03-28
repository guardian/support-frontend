const { readFileSync, writeFile } = require('fs');
const { resolve } = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`, { url: 'http://localhost/' });

global.URL = require('url').URL;
global.URLSearchParams = require('url').URLSearchParams;

global.window = window;
global.window.guardian = {
  settings: {},
  productPrices: {
    'United Kingdom': {
      'Collection': {
        'SixdayPlus': { 'Monthly': { 'GBP': { 'price': 47.62 } } },
        'SundayPlus': { 'Monthly': { 'GBP': { 'price': 22.06 } } },
        'SaturdayPlus': { 'Monthly': { 'GBP': { 'price': 21.62 } } },
        'Saturday': { 'Monthly': { 'GBP': { 'price': 10.36 } } },
        'Sixday': { 'Monthly': { 'GBP': { 'price': 41.12 } } },
        'Weekend': { 'Monthly': { 'GBP': { 'price': 20.76 } } },
        'Sunday': { 'Monthly': { 'GBP': { 'price': 10.79 } } },
        'WeekendPlus': { 'Monthly': { 'GBP': { 'price': 29.42 } } },
        'Everyday': { 'Monthly': { 'GBP': { 'price': 47.62 } } },
        'EverydayPlus': { 'Monthly': { 'GBP': { 'price': 51.96 } } },
      },
      'HomeDelivery': {
        'SixdayPlus': { 'Monthly': { 'GBP': { 'price': 60.62 } } },
        'SundayPlus': { 'Monthly': { 'GBP': { 'price': 26.39 } } },
        'SaturdayPlus': { 'Monthly': { 'GBP': { 'price': 25.96 } } },
        'Saturday': { 'Monthly': { 'GBP': { 'price': 14.69 } } },
        'Sixday': { 'Monthly': { 'GBP': { 'price': 54.12 } } },
        'Weekend': { 'Monthly': { 'GBP': { 'price': 25.09 } } },
        'Sunday': { 'Monthly': { 'GBP': { 'price': 15.12 } } },
        'WeekendPlus': { 'Monthly': { 'GBP': { 'price': 33.76 } } },
        'Everyday': { 'Monthly': { 'GBP': { 'price': 62.79 } } },
        'EverydayPlus': { 'Monthly': { 'GBP': { 'price': 67.12 } } },
      },
    },
  }
};

global.localStorage = {
  getItem: () => "",
  setItem: (k) => {}
};
global.sessionStorage = global.localStorage;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

global.Image = function() {return this};

const { html }  = require('../public/compiled-assets/javascripts/ssr');

writeFile(
  resolve(__dirname, '..', 'conf/ssr-cache/', `paperSubs.html`),
  html, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log(`done`);
  },
);

// const { pages } = require('../public/compiled-assets/javascripts/ssr');
//
// Object.entries(pages).map((path, html) => {
//   writeFile(
//     resolve(__dirname, '..', 'conf/ssr-cache/', `${path.replace(/\//g, '-')}.html`),
//     html, 'utf8', (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log(`done`);
//     },
//   );
// });


