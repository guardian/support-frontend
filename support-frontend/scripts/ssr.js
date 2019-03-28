const { writeFileSync } = require('fs');
const { resolve } = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`, { url: 'http://localhost/' });

//------------- Set up global state --------------

global.URL = require('url').URL;
global.URLSearchParams = require('url').URLSearchParams;

global.window = window;
global.window.guardian = {
  settings: {},
};

global.localStorage = {
  getItem: () => '',
  setItem: (k) => {},
};
global.sessionStorage = global.localStorage;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

global.Image = function () {return this;};


function writePage(path, html) {
  console.log(`Writing ${path}`);

  writeFileSync(
    resolve(__dirname, '..', 'conf/ssr-cache/', `${path.replace(/\//g, '-')}.html`),
    html, 'utf8');
  console.log(`Finished writing ${path}`);
}


//------------- Showcase page --------------

const { getHtml: getShowcase } = require('../public/compiled-assets/javascripts/showcasePage');

writePage('uk/support', getShowcase());

//------------- Paper landing page --------------

window.guardian.productPrices = {
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
};

const { getHtml: getPaper } = require('../public/compiled-assets/javascripts/paperSubscriptionLandingPage');

writePage('uk/subscribe/paper', getPaper());


console.log('Done');
process.exit();




