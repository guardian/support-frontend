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
    const iframe = document.getElementById('gu-font-loader-iframe');
    window.addEventListener('message', (e: MessageEvent) => {
      if (
        iframe instanceof HTMLIFrameElement &&
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
  };

  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', loadFonts);
  } else {
    // DOMContentLoaded has already fired
    loadFonts();
  }
};

fetchFonts(window, document);
