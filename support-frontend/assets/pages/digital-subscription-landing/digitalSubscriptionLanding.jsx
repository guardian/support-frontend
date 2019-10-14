// @flow

// ----- Imports ----- //

import { renderPage } from 'helpers/render';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import CustomerService from 'components/customerService/customerService';
import SubscriptionFaq from 'components/subscriptionFaq/subscriptionFaq';
import Footer from 'components/footer/footer';
import AdFreeSectionB from 'components/adFreeSectionB/adFreeSectionB';

import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/digitalSubscriptionLandingHeader';
import IndependentJournalismSection
  from './components/independentJournalismSection';
import ProductBlockB from './components/productBlockB/productBlockB';
import PromotionPopUp from './components/promotionPopUp';

import './digitalSubscriptionLanding.scss';
import './components/theMoment.scss';
import ConsentBanner from 'components/consentBanner/consentBanner';
import digitalSubscriptionLandingReducer from './digitalSubscriptionLandingReducer';
import { isPostDeployUser } from 'helpers/user/user';
import { dpSale, flashSaleIsActive } from 'helpers/flashSale';
import { DigitalPack } from 'helpers/subscriptions';
import { gaEvent } from 'helpers/tracking/googleTagManager';

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

const mapStateToProps = (state) => {
  const { nativeVariantAllocationTest } = state.common.abParticipations;

  const dailyEditionsVariant = nativeVariantAllocationTest === "1"
    && !isPostDeployUser();

  trackOptimizeExperiment(nativeVariantAllocationTest);

  return {
    dailyEditionsVariant,
  };
};

const trackOptimizeExperiment = (variant: string) => {
  const dailyEditionsExperimentId = 'eA8AlzuTTJqe8lm2DXfe1w';
  gaEvent(
    {
    category: 'ab-test-tracking',
    action: dailyEditionsExperimentId,
    label: variant
  },
    { //these map to dataLayer variables in GTM
      experimentId: dailyEditionsExperimentId,
      experimentVariant: variant
    });
};

type Props = {
  dailyEditionsVariant: boolean,
}

// ----- Render ----- //
function LandingPage(props: Props) {
  // We can't cope with multiple promo codes in the current design
  const promoCode = flashSaleIsActive(DigitalPack, countryGroupId) ? dpSale.promoCode : null;

  return (
    <div>
      <Page
        header={<CountrySwitcherHeader />}
        footer={
          <Footer>
            <CustomerService
              selectedCountryGroup={countryGroupId}
              promoCode={promoCode}
            />
            <SubscriptionFaq subscriptionProduct="DigitalPack" />
          </Footer>}
      >
        <CampaignHeader
          countryGroupId={countryGroupId}
          dailyEditionsVariant={props.dailyEditionsVariant}
        />
        <ProductBlockB />
        <AdFreeSectionB />
        <IndependentJournalismSection />
        <PromotionPopUp />
        <ConsentBanner />
      </Page>
    </div>
  );
}

const ConnectedLandingPage = connect(mapStateToProps)(LandingPage);

const content = (
  <Provider store={store}>
    <ConnectedLandingPage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
