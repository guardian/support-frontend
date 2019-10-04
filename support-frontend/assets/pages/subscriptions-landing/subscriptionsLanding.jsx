// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import FooterContainer from 'components/footer/footerContainer';
import { detect, type CountryGroupId, AUDCountries, Canada, EURCountries, GBPCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import ConsentBanner from 'components/consentBanner/consentBanner';
import './subscriptionsLanding.scss';

import SubscriptionLandingContent from './components/subscriptionsLandingContent';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const store = pageInit();

const Header = headerWithCountrySwitcherContainer({
  path: '/subscribe/weekly',
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    Canada,
    NZDCountries,
    International,
  ],
  trackProduct: 'GuardianWeekly',
});


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<FooterContainer disclaimer privacyPolicy />}
    >
      <SubscriptionLandingContent />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
