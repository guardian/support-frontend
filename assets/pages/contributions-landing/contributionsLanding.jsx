// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect } from 'helpers/internationalisation/countryGroup';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import CountrySwitcherHeaderContainer from './containers/countrySwitcherHeaderContainer';
import ContributionSelectionContainer from './containers/contributionSelectionContainer';
import ContributionPaymentCtasContainer from './containers/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from './containers/payPalContributionButtonContainer';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Internationalisation ----- //

const defaultContributeCopy = 'Your contribution funds and supports The Guardian\'s journalism.';

const countryGroupSpecificDetails: {
  [CountryGroupId]: { contributeCopy: string, reactElementId: string }
} = {
  GBPCountries: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-uk',
  },
  EURCountries: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-eu',
  },
  UnitedStates: {
    contributeCopy: 'Make a monthly commitment to support The Guardian long term or a one-time contribution as and when you feel like it – choose the option that suits you best.',
    reactElementId: 'contributions-landing-page-us',
  },
  AUDCountries: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-au',
  },
  International: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-int',
  },
  NZDCountries: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-nz',
  },
  Canada: {
    contributeCopy: defaultContributeCopy,
    reactElementId: 'contributions-landing-page-ca',
  },
};


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  createPageReducerFor(countryGroupId),
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <CountrySwitcherHeaderContainer />
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
      />
      <Contribute
        copy={countryGroupSpecificDetails[countryGroupId].contributeCopy}
      >
        <ContributionSelectionContainer />
        <ContributionPaymentCtasContainer
          PayPalButton={PayPalContributionButtonContainer}
        />
      </Contribute>
      <Footer disclaimer />
    </div>
  </Provider>
);

renderPage(content, countryGroupSpecificDetails[countryGroupId].reactElementId);
