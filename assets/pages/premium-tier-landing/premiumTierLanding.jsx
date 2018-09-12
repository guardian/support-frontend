// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import CustomerService from 'components/customerService/customerService';
import Footer from 'components/footer/footer';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import PremiumTierLandingHeader from './components/premiumTierLandingHeader';
import IndependentJournalismSection from './components/independentJournalismSection';
import ProductBlock from './components/productBlock';


// ----- Redux Store ----- //

const store = pageInit();

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'premium-tier-landing-page-uk',
  UnitedStates: 'premium-tier-landing-page-us',
  AUDCountries: 'premium-tier-landing-page-au',
  International: 'premium-tier-landing-page-int',
};

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  [
    'GBPCountries',
    'UnitedStates',
    'AUDCountries',
    'International',
  ],
);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer><CustomerService selectedCountryGroup={countryGroupId} /></Footer>}
    >
      <PremiumTierLandingHeader countryGroupId={countryGroupId} />
      <ProductBlock countryGroupId={countryGroupId} />
      <LeftMarginSection modifierClasses={['grey']}>
        <IndependentJournalismSection />
      </LeftMarginSection>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
