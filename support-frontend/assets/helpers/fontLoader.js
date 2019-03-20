// @flow
import * as storage from 'helpers/storage';


const fetchFonts = (window: Object, document: Document): void => {
  const head: null | HTMLHeadElement = document.querySelector('head');

  const useFont = (font: { fontName: string, css: string }): void => {
    const fontClassName = `gu_font__${font.fontName}`;
    if (document.getElementsByClassName(fontClassName).length === 0 && head && font.fontName && font.css) {
      const style: HTMLStyleElement = document.createElement('style');
      style.classList.add(`gu_font__${font.fontName}`);
      style.innerHTML = font.css;
      head.appendChild(style);
    }
  };

  const saveFontToLocalStorage = (font: { fontName: string, css: string }) => {
    const { fontName } = font;
    if (fontName) {
      const currentFontsString = storage.getLocal('guFonts');
      const currentFonts = currentFontsString ? JSON.parse(currentFontsString) : {};
      storage.setLocal('guFonts', JSON.stringify({
        ...currentFonts,
        [fontName]: font,
      }));
    }
  };

  const loadFontsFromLocalStorage = () => {
    const fonts = storage.getLocal('guFonts');
    if (fonts) {
      const fontsObject = JSON.parse(fonts);
      const values = Object.values(fontsObject);
      values.forEach((value) => {
        if (value instanceof Object && value.fontName && value.css) {
          useFont(value);
        }
      });
    }
  };

  const loadFonts = (): void => {

    loadFontsFromLocalStorage();

    // even if we do load the fonts from storage, still check the localStorage of gu.com in case there are any new ones
    const iframe = document.createElement('iframe');
    iframe.src = 'https://theguardian.com/font-loader';
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
              saveFontToLocalStorage(font);
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
