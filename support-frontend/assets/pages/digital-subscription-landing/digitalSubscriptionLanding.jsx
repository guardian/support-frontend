// @flow

// ----- Imports ----- //

import { renderPage } from 'helpers/render';
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { OPTIMIZE_CHECK_TIMEOUT } from 'helpers/optimize/optimize';

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

const mapStateToProps = (state) => {
  const { optimizeExperiments } = state.common;
  const dailyEditionsExperimentId = 'xOzjpaFDQlO5L6_ORotRWA';
  const dailyEditionsVariant = optimizeExperiments
    .filter(exp => exp.id === dailyEditionsExperimentId && exp.variant === '1').length !== 0
    && !isPostDeployUser();

  return {
    dailyEditionsVariant,
    optimizeHasLoaded: optimizeExperiments.length > 0,
  };
};

type Props = {
  dailyEditionsVariant: boolean,
  optimizeHasLoaded: boolean,
}

type State = {
  showPage: boolean,
  pageReadyChecks: number,
}

// ----- Render ----- //
class LandingPage extends Component<Props, State> {
  state = {
    showPage: this.props.optimizeHasLoaded,
    pageReadyChecks: 0,
  }

  checkOptimizeIsReady = (interval: number) => {
    const maxNumberOfChecks = OPTIMIZE_CHECK_TIMEOUT / interval;
    const { pageReadyChecks } = this.state;
    const { optimizeHasLoaded } = this.props;

    if (optimizeHasLoaded || pageReadyChecks > maxNumberOfChecks) {
      this.setState(() => ({
        showPage: true,
      }));
    } else {
      this.setState(prevState => ({
        pageReadyChecks: prevState.pageReadyChecks + 1,
      }));

      setTimeout(() => {
        this.checkOptimizeIsReady(interval);
      }, interval);
    }
  }

  render() {
    const { dailyEditionsVariant } = this.props;
    const { pageReadyChecks, showPage } = this.state;
    const interval = 250;
    if (pageReadyChecks === 0 && showPage === false) {
      this.checkOptimizeIsReady(interval);
    }

    return (
      <div>
        {showPage && (
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
          <div>
            <ProductBlockB />
            <AdFreeSectionB />
          </div>
          <IndependentJournalismSection />
          <PromotionPopUp />
          <ConsentBanner />
        </Page>)
    }
      </div>
    );

  }
}

const ConnectedLandingPage = connect(mapStateToProps)(LandingPage);

const content = (
  <Provider store={store}>
    <ConnectedLandingPage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
