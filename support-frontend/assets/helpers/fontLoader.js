// @flow

const fetchFonts = (window: Object, document: Document): void => {
  const head: null | HTMLHeadElement = document.querySelector('head');

  const useFont = (font: { css: string }): void => {
    if (head) {
      const style: HTMLStyleElement = document.createElement('style');
      style.innerHTML = font.css;
      head.appendChild(style);
    }
  };

  const loadFonts = (): void => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.theguardian.com/font-loader';
    // add iframe and wait for message
    iframe.style.display = 'none';
    window.addEventListener('message', (e: MessageEvent) => {
      if (
        e &&
        e.data &&
        e.data.name &&
        e.data.name === 'guardianFonts' &&
        e.data.fonts &&
        e.source === iframe.contentWindow
      ) {
        if (Array.isArray(e.data.fonts)) {
          e.data.fonts.forEach((font) => {
            if (font instanceof Object) {
              useFont(font);
            }
          });
        }
      }
    });
    if (document.body) {
      document.body.appendChild(iframe);
    }
  };

  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', loadFonts);
  } else {
    // DOMContentLoaded has already fired
    loadFonts();
  }
};

export default fetchFonts;
