const { writeFileSync } = require('fs');
const { resolve } = require('path');
const jsdom = require('jsdom');

// ------------- Set up global state --------------
const { JSDOM } = jsdom;
const { window } = new JSDOM('...', { url: 'http://localhost/' });

global.URL = require('url').URL;
global.URLSearchParams = require('url').URLSearchParams;

global.window = window;
global.window.guardian = {
  settings: {},
  ssr: true,
};

global.localStorage = {
  getItem: () => '',
  setItem: () => {},
};
global.sessionStorage = global.localStorage;
global.document = window.document;
global.document.cookie = 'GU_TK=1.1553079258164';
global.navigator = {
  userAgent: 'node.js',
};

global.Image = function image() { return this; };

// Appeases emotion SSR
// cf. https://github.com/emotion-js/emotion/issues/1185
global.HTMLElement = window.HTMLElement;

// -------------- Write pages to file ----------------

// eslint-disable-next-line
const { ssrPages } = require('../public/compiled-assets/javascripts/ssrPages').Support;

ssrPages.pages.forEach((page) => {
  global.document.head = global.document.createElement('head');

  const { filename, html } = page;

  const styleTags = global.document.head.querySelectorAll('style[data-emotion]');
  const styles = Array.from(styleTags).map(tag => tag.innerHTML)

  console.log(`Writing ${filename}`);

  const fileContents = `<style>${styles.join('')}</style>${html}`;

  writeFileSync(
    resolve(__dirname, '..', 'conf/ssr-cache/', `${filename}`),
    fileContents, 'utf8',
  );
  console.log(`Finished writing ${filename}`);
});

console.log('Done');
process.exit();
