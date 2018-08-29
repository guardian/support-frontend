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
import SvgEnveloppe from 'components/svgs/enveloppe';
import SvgGlobe from 'components/svgs/globe';
import SvgUser from 'components/svgs/user';

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
              <SvgUser />
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-lname">
          <label className="form__label" htmlFor="contributionLastName">Last Name</label>
          <span className="form__input-with-icon">
            <input id="contributionLastName" className="form__input" aria-describedby="error-contributionLastName" autoCapitalize="words" type="text" required />
            <span className="form__icon">
              <SvgUser />
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-email">
          <label className="form__label" htmlFor="contributionEmail">Email address</label>
          <span className="form__input-with-icon">
            <input id="contributionEmail" className="form__input" type="email" placeholder="example@domain.com" required />
            <span className="form__icon">
              <SvgEnveloppe />
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
