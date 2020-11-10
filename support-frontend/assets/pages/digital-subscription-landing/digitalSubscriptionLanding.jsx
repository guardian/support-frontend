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
import CampaignHeader from './components/hero/hero';
import CampaignHeaderGift from './components/heroGift/hero';
import ProductBlock from './components/productBlock/productBlock';
import ProductBlockAus from './components/productBlock/productBlockAus';
import './digitalSubscriptionLanding.scss';
import digitalSubscriptionLandingReducer
  from './digitalSubscriptionLandingReducer';
import { CallToAction, CallToActionGift } from './components/cta';
import GiftNonGiftLink from './components/giftNonGiftLink';
import DigitalFooter from 'components/footerCompliant/DigitalFooter';
// ----- Styles ----- //

import './components/digitalSubscriptionLanding.scss';
import 'stylesheets/skeleton/skeleton.scss';

// ----- Redux Store ----- //

const store = pageInit(() => digitalSubscriptionLandingReducer, true);

const { orderIsAGift, productPrices } = store.getState().page;

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

const path = orderIsAGift ? '/subscribe/digital/gift' : '/subscribe/digital';

const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
  path,
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
  const footer = (
    <div className="footer-container">
      <div className="footer-alignment">
        <DigitalFooter
          country={countryGroupId}
          orderIsAGift={orderIsAGift}
          productPrices={productPrices}
          centred
        />
      </div>
    </div>);

  return (
    <Page
      header={<CountrySwitcherHeader />}
      footer={footer}
    >
      {orderIsAGift ?
        <CampaignHeaderGift countryGroupId={countryGroupId} /> :
        <CampaignHeader countryGroupId={countryGroupId} />
      }
      {countryGroupId === AUDCountries ?
        <ProductBlockAus countryGroupId={countryGroupId} /> :
        <ProductBlock countryGroupId={countryGroupId} />
      }
      {orderIsAGift ? <CallToActionGift /> : <CallToAction />}
      <GiftNonGiftLink orderIsAGift={orderIsAGift} />
    </Page>
  );

}

const content = (
  <Provider store={store}>
    <LandingPage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
