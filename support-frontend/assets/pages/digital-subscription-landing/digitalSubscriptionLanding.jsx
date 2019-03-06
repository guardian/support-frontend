// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
// import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import Footer from 'components/footer/footer';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import Content from 'components/content/content';
import Text from 'components/text/text';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
// import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
// import AnchorButton from 'components/button/anchorButton';
// import GridPicture from 'components/gridPicture/gridPicture';
// import SvgChevron from 'components/svgs/chevron';
import 'stylesheets/skeleton/skeleton.scss';

import DigitalSubscriptionLandingHeader from './components/digitalSubscriptionLandingHeader';
import IndependentJournalismSection from './components/independentJournalismSection';
import ProductBlock from './components/productBlock';
import PromotionPopUp from './components/promotionPopUp';
import digitalSubscriptionLandingReducer from './digitalSubscriptionLandingReducer';
import Form from './components/form';

import './digitalSubscriptionLanding.scss';

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

const CountrySwitcherHeader = headerWithCountrySwitcherContainer(
  '/subscribe/digital',
  [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    NZDCountries,
    Canada,
    International,
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


      {/* <ProductPagehero
        appearance="feature"
        overheading="Guardian Weekly subscriptions"
        heading="Get a clearer, global perspective on the issues that matter, in one magazine."
        modifierClasses={['weekly']}
        content={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
        hasCampaign={false}
      >
        <GridPicture
          sources={[
            {
              gridId: 'weeklyLandingHero',
              srcSizes: [500, 1000],
              imgType: 'png',
              sizes: '100vw',
              media: '(max-width: 739px)',
            },
            {
              gridId: 'weeklyLandingHero',
              srcSizes: [1000, 2000],
              imgType: 'png',
              sizes: '(min-width: 1000px) 2000px, 1000px',
              media: '(min-width: 740px)',
            },
          ]}
          fallback="weeklyLandingHero"
          fallbackSize={1000}
          altText=""
          fallbackImgType="png"
        />

      </ProductPagehero> */}

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
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
