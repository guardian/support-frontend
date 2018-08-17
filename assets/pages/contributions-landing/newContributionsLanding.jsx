// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import Page from 'components/page/page';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));


const reactElementId: {
  [CountryGroupId]: string
} = {
  GBPCountries: 'new-contributions-landing-page-uk',
  EURCountries: 'new-contributions-landing-page-eu',
  UnitedStates: 'new-contributions-landing-page-us',
  AUDCountries: 'new-contributions-landing-page-au',
  International: 'new-contributions-landing-page-int',
  NZDCountries: 'new-contributions-landing-page-nz',
  Canada: 'new-contributions-landing-page-ca',
};

// ----- Internationalisation ----- //

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a monthly commitment to support The Guardian long term or a one-off contribution 
  as and when you feel like it – choose the option that suits you best.
`;

const countryGroupSpecificDetails: {
  [CountryGroupId]: {headerCopy: string, contributeCopy: string}
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
};

const selectedCountry = countryGroups[countryGroupId];

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={
        <header role="banner" className="gu-content__header">
          <a className="glogo" href="https://www.theguardian.com"><img src="/assets-payment/roundel.svg" alt="The Guardian" /></a>
          <details className="countries">
            <summary aria-label="Selected country: {selectedCountry.name} ({currencies[selectedCountry.currency]})">
              <svg className="icon icon--world" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M3.429 3.143H6.57V0a6.46 6.46 0 0 0-2.133.46 5.43 5.43 0 0 0-.54 1.076c-.2.516-.356 1.062-.47 1.607M3.336 1.376c.03-.078.062-.155.093-.233a7.155 7.155 0 0 0-2.286 2.286h1.606c.139-.7.34-1.384.587-2.053M2.356 7.429H0C.046 8.325.277 9.192.678 10H2.57c-.138-.852-.2-1.72-.215-2.571M2.571 4H.678A6.528 6.528 0 0 0 0 6.571h2.356c.015-.867.092-1.719.215-2.571M11.465 3.143h1.392a7.05 7.05 0 0 0-2-2c.015.029.03.072.045.1.237.62.43 1.252.563 1.9M11.931 6.571H14A6.861 6.861 0 0 0 13.363 4h-1.649c.13.852.203 1.704.217 2.571M10.571 3.129c-.113-.546-.27-1.091-.469-1.608A5.618 5.618 0 0 0 9.604.502 6.767 6.767 0 0 0 7.43 0v3.143h3.142v-.014zM7.429 10h3.487c.136-.852.212-1.704.227-2.571H7.429V10zM11.714 10h1.65A6.861 6.861 0 0 0 14 7.429h-2.069A19.27 19.27 0 0 1 11.714 10M10.571 10.857H7.43V14a6.682 6.682 0 0 0 2.175-.502c.2-.316.37-.66.498-1.02.2-.53.356-1.061.47-1.62M3.429 10.857c.113.54.27 1.08.469 1.607.142.384.327.74.54 1.08.683.271 1.408.413 2.133.456v-3.129l-3.142-.014zM6.857 4H3.368a18.36 18.36 0 0 0-.225 2.571h3.714V4zM10.902 12.756c-.015.044-.03.072-.045.101a7.05 7.05 0 0 0 2-2h-1.392c-.134.648-.326 1.28-.563 1.9M11.143 6.571c-.015-.867-.09-1.719-.227-2.571H7.43v2.571h3.714zM2.749 10.857H1.143a7.314 7.314 0 0 0 2.286 2.286c-.031-.078-.078-.156-.093-.233a13.525 13.525 0 0 1-.587-2.053M3.143 7.429c.015.867.09 1.719.226 2.571h3.488V7.429H3.143z" /></svg>
              <span className="countries__label">{selectedCountry.name} ({currencies[selectedCountry.currency].extendedGlyph})</span>
              <span className="icon icon--arrows">
                <svg width="19" height="10" xmlns="http://www.w3.org/2000/svg"><path className="icon__arrow-down" d="M1.25.5l-.75.75L9 9.5h.95l8.55-8.25-.75-.75L9.5 7.25z" /><path className="icon__arrow-up" d="M1.25 9.5L.5 8.75 9 .5h.95l8.55 8.25-.75.75L9.5 2.75z" /></svg>
              </span>
            </summary>
            <ul className="countries__list">
              {Object.values(countryGroups).map(g => (g === selectedCountry ? (
                <li className="countries__item">
                  <a href={`/${g.supportInternationalisationId}/contribute.react`}>
                    <span className="icon">
                      <svg width="18" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.36 6.9l-.86.888L4.798 14h.409L17.5.865 16.64 0 5.207 10.694z" /></svg>
                    </span>
                    {g.name} ({currencies[g.currency].extendedGlyph})
                  </a>
                </li>
              ) : (
                <li className="countries__item"><a href={`/${g.supportInternationalisationId}/contribute.react`}>{g.name} ({currencies[g.currency].extendedGlyph})</a></li>
              )))}
            </ul>
          </details>
        </header>
      }
      footer={
        <footer role="contentinfo" className="gu-content__footer">
          <div className="license">
            <small className="license__txt">© 2018 Guardian News and Media Limited or its affiliated companies. All rights reserved.</small>
            <p>The ultimate owner of the Guardian is The Scott Trust Limited, whose role it is to secure the editorial and financial independence of the Guardian in perpetuity. Reader contributions support the Guardian’s journalism. Please note that your support of the Guardian’s journalism does not constitute a charitable donation, as such your contribution is not eligible for Gift Aid in the UK nor a tax-deduction elsewhere. If you have any questions about contributing to the Guardian, please <a href="mailto:contribution.support@theguardian.com">contact us here</a>.</p>
          </div>
        </footer>
      }
    >
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
