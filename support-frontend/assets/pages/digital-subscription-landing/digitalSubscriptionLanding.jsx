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
import Footer, { FooterCentered } from 'components/footer/footer';

import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/digitalSubscriptionLandingHeader';
import { CampaignHeaderB } from './componentsB/digitalSubscriptionLandingHeader';
import IndependentJournalismSection
  from './componentsB/independentJournalismSection';
import ProductBlock from './components/productBlock';
import PromotionPopUp from './componentsB/promotionPopUp';

import './digitalSubscriptionLanding.scss';
import ConsentBanner from 'components/consentBanner/consentBanner';
import digitalSubscriptionLandingReducer from './digitalSubscriptionLandingReducer';
import { isPostDeployUser } from 'helpers/user/user';
import { dpSale, flashSaleIsActive } from 'helpers/flashSale';
import { DigitalPack } from 'helpers/subscriptions';
import CallToAction from './components/cta';
import ProductBlockB from './componentsB/productBlockB/productBlockB';
import AdFreeSectionB from 'components/adFreeSectionB/adFreeSectionB';
import TermsAndConditions from './components/termsAndConditions';
import FaqsAndHelp from './components/faqsAndHelp';
import { gaEvent } from 'helpers/tracking/googleTagManager';

// ----- Styles ----- //
import './components/digitalSubscriptionLanding.scss';
import './componentsB/theMoment.scss';

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

const trackOptimizeExperiment = (variant: string) => {
  const dailyEditionsExperimentId = 'eA8AlzuTTJqe8lm2DXfe1w';
  gaEvent(
    {
      category: 'ab-test-tracking',
      action: dailyEditionsExperimentId,
      label: variant,
    },
    { // these map to dataLayer variables in GTM
      experimentId: dailyEditionsExperimentId,
      experimentVariant: variant,
    },
  );
};


const mapStateToProps = (state) => {
  const { nativeVariantAllocationTest } = state.common.abParticipations;

  const dailyEditionsVariant = nativeVariantAllocationTest === '1'
    && !isPostDeployUser();

  trackOptimizeExperiment(nativeVariantAllocationTest);

  return {
    dailyEditionsVariant,
  };
};

type Props = {
  dailyEditionsVariant: boolean,
}

// This is a temporary variant controller for the A/B tests
// So if the environment is DEV, we see the new version but in prodction we see the old version
const pageType = process.env.NODE_ENV === 'DEV' ? 'A' : 'B';

// ----- Render ----- //
function LandingPage(props: Props) {
  const { dailyEditionsVariant } = props;

  // We can't cope with multiple promo codes in the current design

  const promoCode = flashSaleIsActive(DigitalPack, countryGroupId) ? dpSale.promoCode : null;

  const pageTypeA = (
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
      <CallToAction dailyEditionsVariant={dailyEditionsVariant} />
      <TermsAndConditions />
      <ConsentBanner />
    </Page>
  );

  const pageTypeB = (
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
      <CampaignHeaderB
        countryGroupId={countryGroupId}
        dailyEditionsVariant={dailyEditionsVariant}
      />
      <ProductBlockB />
      <AdFreeSectionB />
      <IndependentJournalismSection />
      <PromotionPopUp />
      <ConsentBanner />
    </Page>
  );

  return (
    <div>
      {pageType === 'A' && pageTypeA}
      {pageType === 'B' && pageTypeB}
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
