// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import Footer from 'components/footer/footer';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import Content from 'components/content/content';
import Text from 'components/text/text';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import 'stylesheets/skeleton/skeleton.scss';


import { SaleHeader } from './components/digitalSubscriptionLandingHeader';
import IndependentJournalismSection from './components/independentJournalismSection';
import ProductBlock from './components/productBlock';
import PromotionPopUp from './components/promotionPopUp';
import digitalSubscriptionLandingReducer from './digitalSubscriptionLandingReducer';
import Form from './components/form';

import './digitalSubscriptionLanding.scss';
import './components/theMoment.scss';
import ConsentBanner from 'components/consentBanner/consentBanner';

// ----- Redux Store ----- //

const store = pageInit(() => digitalSubscriptionLandingReducer(null), true);

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
  listOfCountries: [
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

const content = (
  <Provider store={store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={
        <Footer>
          <CustomerService selectedCountryGroup={countryGroupId} />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </Footer>}
    >

      <SaleHeader countryGroupId={countryGroupId} />

      <ProductBlock countryGroupId={countryGroupId} />
      <AdFreeSection headingSize={2} />
      <Content appearance="feature" id="subscribe">
        <Text title="Subscribe to Digital Pack today">
          <p>Choose how you’d like to pay</p>
        </Text>
        <Form />
        <ProductPageInfoChip >
            You can cancel your subscription at any time
        </ProductPageInfoChip>
      </Content>
      <IndependentJournalismSection />
      <PromotionPopUp />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
