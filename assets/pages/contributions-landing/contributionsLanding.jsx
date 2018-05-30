// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

// React components
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';

// React components connected to redux store
import CountrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect } from 'helpers/internationalisation/countryGroup';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// Page-specific react components connected to redux store
import ContributionSelectionContainer from './containers/contributionSelectionContainer';
import ContributionPaymentCtasContainer from './containers/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from './containers/payPalContributionButtonContainer';
import ContributionAwarePaymentLogosContainer from './containers/contributionAwarePaymentLogosContainer';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const oneOffOnlyVariant = (store && store.getState().common.abParticipations.ContributeLandingOneOffOnlyTest) || 'notintest';

// ----- Internationalisation ----- //

const defaultHeaderCopy = ['Help us deliver', 'the independent', 'journalism the', 'world needs'];
const defaultContributeCopy = oneOffOnlyVariant && oneOffOnlyVariant === 'oneOffOnly'
  ? 'Your contribution funds and supports The Guardian\'s journalism.'
  : 'Make a monthly commitment to support The Guardian long term or a one-off contribution as and when you feel like it – choose the option that suits you best.';

const usContributeCopy = oneOffOnlyVariant && oneOffOnlyVariant === 'oneOffOnly'
  ? 'Your contribution funds and supports The Guardian\'s journalism.'
  : 'Make a monthly commitment to support The Guardian long term or a one-time contribution as and when you feel like it – choose the option that suits you best.';

const countryGroupSpecificDetails: {
  [CountryGroupId]: {headerCopy: string[], contributeCopy: string, reactElementId: string}
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-uk',
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-eu',
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: usContributeCopy,
    reactElementId: 'contributions-landing-page-us',
  },
  AUDCountries: {
    headerCopy: ['Help us deliver', 'the independent', 'journalism', 'Australia needs'],
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-au',
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-int',
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-nz',
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-ca',
  },
};


// ----- Render ----- //

const desktopAboveTheFold = store && store.getState().common.abParticipations.desktopAboveTheFold;
const variantHeader = ['Help us deliver the', 'independent journalism', 'the world needs'];

if (desktopAboveTheFold === 'variant') {
  countryGroupSpecificDetails.GBPCountries.headerCopy = variantHeader;
  countryGroupSpecificDetails.EURCountries.headerCopy = variantHeader;
  countryGroupSpecificDetails.UnitedStates.headerCopy = variantHeader;
  countryGroupSpecificDetails.AUDCountries.headerCopy = variantHeader;
  countryGroupSpecificDetails.International.headerCopy = variantHeader;
  countryGroupSpecificDetails.NZDCountries.headerCopy = variantHeader;
  countryGroupSpecificDetails.Canada.headerCopy = variantHeader;

}

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <CountrySwitcherHeaderContainer />
      <CirclesIntroduction
        headings={countryGroupSpecificDetails[countryGroupId].headerCopy}
        highlights={['Support', 'The Guardian']}
        desktopAboveTheFoldVariant={desktopAboveTheFold}
      />
      <Contribute
        copy={countryGroupSpecificDetails[countryGroupId].contributeCopy}
        desktopAboveTheFoldVariant={desktopAboveTheFold}
      >
        <ContributionSelectionContainer
          oneOffOnlyVariant={oneOffOnlyVariant}
        />
        <ContributionAwarePaymentLogosContainer />
        <ContributionPaymentCtasContainer
          PayPalButton={PayPalContributionButtonContainer}
        />
      </Contribute>
      <Footer disclaimer />
    </div>
  </Provider>
);

renderPage(content, countryGroupSpecificDetails[countryGroupId].reactElementId);
