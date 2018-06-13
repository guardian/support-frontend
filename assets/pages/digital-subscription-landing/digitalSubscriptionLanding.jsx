// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import CustomerService from 'components/customerService/customerService';
import Footer from 'components/footer/footer';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import IndependentJournalismSection from './components/independentJournalismSection';
import PriceCtaContainer from './components/priceCtaContainer';
import ProductBlock from './components/productBlock';


// ----- Redux Store ----- //

const store = pageInit();


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-landing-page-uk',
  UnitedStates: 'digital-subscription-landing-page-us',
  International: 'digital-subscription-landing-page-int',
};

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  ['GBPCountries', 'UnitedStates', 'International'],
);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <CountrySwitcherHeader />
      <LeftMarginSection modifierClasses={['grey']}>
        <h1>Support The Guardian with a digital subscription</h1>
        <PriceCtaContainer dark />
      </LeftMarginSection>
      <ProductBlock />
      <LeftMarginSection modifierClasses={['grey']}>
        <IndependentJournalismSection />
      </LeftMarginSection>
      <Footer><CustomerService selectedCountryGroup={countryGroupId} /></Footer>
    </div>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
