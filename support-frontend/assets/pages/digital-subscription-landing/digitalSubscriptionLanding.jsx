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
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import Footer from 'components/footer/footer';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import AdFreeSectionB from 'components/adFreeSectionB/adFreeSectionB';
import Content from 'components/content/content';
import Text from 'components/text/text';
import ProductPageInfoChip
  from 'components/productPage/productPageInfoChip/productPageInfoChip';
import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/digitalSubscriptionLandingHeader';
import IndependentJournalismSection
  from './components/independentJournalismSection';
import ProductBlock from './components/productBlock';
import ProductBlockB from './components/productBlockB/productBlockB';
import PromotionPopUp from './components/promotionPopUp';
import Form from './components/form';

import './digitalSubscriptionLanding.scss';
import './components/theMoment.scss';
import ConsentBanner from 'components/consentBanner/consentBanner';
import digitalSubscriptionLandingReducer
  from './digitalSubscriptionLandingReducer';

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

const { optimizeExperiments } = store.getState().common;

const dailyEditionsExperimentId = 'zFSCLqNKT4yQKFNEraigAQ';
const dailyEditionsVariant = optimizeExperiments
  .filter(exp => exp.id === dailyEditionsExperimentId && exp.variant === '1').length !== 0;

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

      <CampaignHeader
        countryGroupId={countryGroupId}
        dailyEditionsVariant={dailyEditionsVariant}
      />
      {dailyEditionsVariant ?
        (
          <div>
            <ProductBlockB />
            <AdFreeSectionB />
          </div>
        ) : (
          <div>
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
          </div>
        )
      }
      <IndependentJournalismSection />
      <PromotionPopUp />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
