// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import OptimizeExperimentWrapper from 'components/optimizeExperimentWrapper/optimizeExperimentWrapper';
import Page from 'components/page/page';
import simpleHeaderWithCountrySwitcherContainer from 'components/headers/simpleHeader/simpleHeaderWithCountrySwitcher';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import Footer from 'components/footer/footer';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';

import DigitalSubscriptionLandingHeader from './components/digitalSubscriptionLandingHeader';
import IndependentJournalismSection from './components/independentJournalismSection';
import ProductBlock from './components/productBlock';
import PromotionPopUp from './components/promotionPopUp';
import digitalSubscriptionLandingReducer from './digitalSubscriptionLandingReducer';
import Form from './components/form';
import { experimentId } from './helpers/ctaTypeAb';

import './digitalSubscriptionLanding.scss';

// ----- Redux Store ----- //

const store = pageInit(digitalSubscriptionLandingReducer(null), true);

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

const CountrySwitcherHeader = simpleHeaderWithCountrySwitcherContainer(
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
      footer={
        <Footer>
          <CustomerService selectedCountryGroup={countryGroupId} />
          <SubscriptionFaq subscriptionProduct="DigitalPack" />
        </Footer>}
    >
      <DigitalSubscriptionLandingHeader
        countryGroupId={countryGroupId}
      />
      <ProductBlock countryGroupId={countryGroupId} />
      <AdFreeSection headingSize={2} />
      <OptimizeExperimentWrapper experimentId={experimentId}>
        <div />
        <div />
        <ProductPageContentBlock type="feature" id="subscribe">
          <ProductPageTextBlock title="Subscribe to Digital Pack today">
            <p>Choose how you’d like to pay</p>
          </ProductPageTextBlock>
          <Form />
          <ProductPageInfoChip >
              You can cancel your subscription at any time
          </ProductPageInfoChip>
        </ProductPageContentBlock>
      </OptimizeExperimentWrapper>
      <IndependentJournalismSection />
      <PromotionPopUp />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
