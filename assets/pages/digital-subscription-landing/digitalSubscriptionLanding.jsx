// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import Footer from 'components/footer/footer';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import DigitalSubscriptionLandingHeader from './components/digitalSubscriptionLandingHeader';
import PriceCtaContainer from './components/priceCtaContainer';


// ----- Redux Store ----- //

const store = pageInit();


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-landing-page-uk',
  UnitedStates: 'digital-subscription-landing-page-us',
  AUDCountries: 'digital-subscription-landing-page-au',
  International: 'digital-subscription-landing-page-int',
};

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  ['GBPCountries', 'UnitedStates', 'AUDCountries', 'International'],
);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <CountrySwitcherHeader />
      <DigitalSubscriptionLandingHeader />
      <LeftMarginSection>
        <h2>Enjoy our quality, independent journalism, plus some extra features, on mobile and tablet apps</h2>
        <PriceCtaContainer />
      </LeftMarginSection>
      <LeftMarginSection>
        <h2>Your subscription helps support independent investigative journalism</h2>
        <PriceCtaContainer />
      </LeftMarginSection>
      <Footer />
    </div>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
