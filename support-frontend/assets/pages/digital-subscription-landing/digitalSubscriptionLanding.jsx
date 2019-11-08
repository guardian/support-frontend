// @flow

// ----- Imports ----- //

import { renderPage } from 'helpers/render';
import React from 'react';
import { Provider } from 'react-redux';
import {
  AUDCountries,
  Canada,
  type CountryGroupId,
  detect,
  EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import { FooterCentered } from 'components/footer/footer';

import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/digitalSubscriptionLandingHeader';
import ProductBlock from './components/productBlock';

import './digitalSubscriptionLanding.scss';
import ConsentBanner from 'components/consentBanner/consentBanner';
import digitalSubscriptionLandingReducer
  from './digitalSubscriptionLandingReducer';
import { dpSale, flashSaleIsActive } from 'helpers/flashSale';
import { DigitalPack } from 'helpers/subscriptions';
import CallToAction from './components/cta';
import TermsAndConditions from './components/termsAndConditions';
import FaqsAndHelp from './components/faqsAndHelp';
// ----- Styles ----- //
import './components/digitalSubscriptionLanding.scss';

// ----- Redux Store ----- //

const store = pageInit(() => digitalSubscriptionLandingReducer(), true);

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'digital-subscription-landing-page-uk',
  UnitedStates: 'digital-subscription-landing-page-us',
  AUDCountries: 'digital-subscription-landing-page-au',
  EURCountries: 'digital-subscription-landing-page-eu',
  NZDCountries: 'digital-subscription-landing-page-nz',
  Canada: 'digital-subscription-landing-page-ca',
  International: 'digital-subscription-landing-page-int',
};

const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
  path: '/subscribe/digital',
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    NZDCountries,
    Canada,
    International,
  ],
});

// ----- Render ----- //
function LandingPage() {

  // We can't cope with multiple promo codes in the current design
  const promoCode = flashSaleIsActive(DigitalPack, countryGroupId) ? dpSale.promoCode : null;

  return (
    <Page
      header={<CountrySwitcherHeader />}
      footer={
        <FooterCentered>
          <FaqsAndHelp
            selectedCountryGroup={countryGroupId}
            promoCode={promoCode}
          />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </FooterCentered>}
    >
      <CampaignHeader countryGroupId={countryGroupId} />
      <ProductBlock />
      <CallToAction />
      <TermsAndConditions />
      <ConsentBanner />
    </Page>
  );

}

const content = (
  <Provider store={store}>
    <LandingPage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
