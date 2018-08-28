// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { amounts, getFrequency, type Contrib } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId, type CountryGroup } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

import { NewContributionType } from './new_components/ContributionType';
import { formatAmount, NewContributionAmount } from './new_components/ContributionAmount';

import { countryGroupSpecificDetails } from './contributionsLandingMetadata';
import { createPageReducerFor } from './contributionsLandingReducer';
import { NewContributionState } from './ContributionState';

import SvgCheckmark from 'components/svgs/checkmark';
import SvgChevron from 'components/svgs/chevron';
import SvgGlobe from 'components/svgs/globe';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const contributionType: Contrib = 'MONTHLY';

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];

const selectedCountryGroup = countryGroups[countryGroupId];

const selectedAmounts = amounts('notintest')[contributionType][countryGroupId];

// ----- Render ----- //

const renderCountryGroup = (countryGroup: CountryGroup) => (
  <li className="countryGroups__item">
    <a href={`/${countryGroup.supportInternationalisationId}/contribute.react`}>
      {countryGroup === selectedCountryGroup ? (
        <span className="icon">
          <SvgCheckmark />
        </span>
      ) : ''}
      {countryGroup.name} ({currencies[countryGroup.currency].extendedGlyph})
    </a>
  </li>
);

const content = (
  <Provider store={store}>
    <Page
      header={
        <header role="banner" className="gu-content__header">
          <a className="glogo" href="https://www.theguardian.com"><img src="/assets-payment/roundel.svg" alt="The Guardian" /></a>
          <details className="countryGroups">
            <summary aria-label={`Selected country: ${selectedCountryGroup.name} (${currencies[selectedCountryGroup.currency].glyph})`}>
              <SvgGlobe />
              <span className="countryGroups__label">{selectedCountryGroup.name} ({currencies[selectedCountryGroup.currency].extendedGlyph})</span>
              <span className="icon icon--arrows">
                <SvgChevron />
              </span>
            </summary>
            <ul className="countryGroups__list">
              {(Object.values(countryGroups): any).map(renderCountryGroup)}
            </ul>
          </details>
        </header>
      }
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form action="#" method="post" className="form form--contribution">
        <NewContributionType />
        <NewContributionAmount countryGroupDetails={selectedCountryGroupDetails} />

        <div className="form__field form__field--contribution-fname">
          <label className="form__label" htmlFor="contributionFirstName">First Name</label>
          <span className="form__input-with-icon">
            <input id="contributionFirstName" className="form__input" type="text" autoCapitalize="words" required />
            <span className="form__icon">
              <svg width="14" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M6.99 7.381c1.433 0 3.121-1.66 3.121-3.683C10.111 1.674 8.953.5 6.991.5 5.026.5 3.888 1.674 3.888 3.698c0 2.023 1.825 3.683 3.101 3.683zM2.333 9.789l-.797.83L0 16.69l.758.81h12.445l.797-.81-1.556-6.071-.777-.83C10.11 9.283 8.692 9 7 9c-1.711 0-3.111.243-4.667.79z" fillRule="evenodd" /></svg>
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-lname">
          <label className="form__label" htmlFor="contributionLastName">Last Name</label>
          <span className="form__input-with-icon">
            <input id="contributionLastName" className="form__input" aria-describedby="error-contributionLastName" autoCapitalize="words" type="text" required />
            <span className="form__icon">
              <svg width="14" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M6.99 7.381c1.433 0 3.121-1.66 3.121-3.683C10.111 1.674 8.953.5 6.991.5 5.026.5 3.888 1.674 3.888 3.698c0 2.023 1.825 3.683 3.101 3.683zM2.333 9.789l-.797.83L0 16.69l.758.81h12.445l.797-.81-1.556-6.071-.777-.83C10.11 9.283 8.692 9 7 9c-1.711 0-3.111.243-4.667.79z" /></svg>
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-email">
          <label className="form__label" htmlFor="contributionEmail">Email address</label>
          <span className="form__input-with-icon">
            <input id="contributionEmail" className="form__input" type="email" placeholder="example@domain.com" required />
            <span className="form__icon">
              <svg width="16" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M.902 0L8 6.213 15.098 0H.902zM0 .787v8.42l4.787-4.232L0 .787zm16 0l-4.787 4.188L16 9.206V.787zM5.689 5.763L.896 10h14.208L10.31 5.763 8.378 7.456a.575.575 0 0 1-.756 0L5.689 5.763z" /></svg>
            </span>
          </span>
        </div>
        <NewContributionState countryGroupId={countryGroupId} />
        <fieldset className="form__radio-group form__radio-group--buttons form__radio-group--contribution-pay">
          <legend className="form__legend form__legend--radio-group">Pay with</legend>

          <ul className="form__radio-group__list">
            <li className="form__radio-group__item">
              <input id="contributionPayment-paypal" className="form__radio-group__input" name="contributionPayment" type="radio" value="paypal" checked />
              <label htmlFor="contributionPayment-paypal" className="form__radio-group__label">
                <span className="radio-ui" />
                <span className="radio-ui__label">PayPal</span>
                <img className="radio-ui__icon radio-ui__icon--paypal" src="/assets-payment/paypal.png" alt="" />
              </label>
            </li>
            <li className="form__radio-group__item">
              <input id="contributionPayment-card" className="form__radio-group__input" name="contributionPayment" type="radio" value="card" />
              <label htmlFor="contributionPayment-card" className="form__radio-group__label">
                <span className="radio-ui" />
                <span className="radio-ui__label">Credit/Debit Card</span>
                <img className="radio-ui__icon radio-ui__icon--card" src="/assets-payment/card.svg" alt="" />
              </label>
            </li>
          </ul>
        </fieldset>
        <div className="form__submit">
          <button className="form__submit__button" type="submit">
            Contribute&nbsp;
            {formatAmount(selectedCountryGroupDetails, selectedAmounts[0], false)}&nbsp;
            {getFrequency(contributionType)}
          </button>
        </div>
      </form>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
