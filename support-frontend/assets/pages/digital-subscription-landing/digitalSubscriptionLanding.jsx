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
import { routes } from 'helpers/routes';

import Page from 'components/page/page';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import { getPromotionCopy } from 'helpers/productPrice/promotions';

import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import CampaignHeader from './components/hero/hero';
import CampaignHeaderGift from './components/heroGift/hero';
import ProductBlock from './components/productBlock/productBlock';
import ProductBlockAus from './components/productBlock/productBlockAus';
import './digitalSubscriptionLanding.scss';
import digitalSubscriptionLandingReducer
  from './digitalSubscriptionLandingReducer';
import Prices from './components/prices';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import DigitalFooter from 'components/footerCompliant/DigitalFooter';
// ----- Styles ----- //

import './components/digitalSubscriptionLanding.scss';
import 'stylesheets/skeleton/skeleton.scss';

// ----- Redux Store ----- //

const store = pageInit(() => digitalSubscriptionLandingReducer, true);

const { common, page } = store.getState();
const { orderIsAGift, productPrices, promotionCopy } = page;
const { abParticipations } = common;
const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
const accordionOpen = abParticipations.accordionTest === 'accordionOpen';

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

const path = orderIsAGift ? routes.digitalSubscriptionLandingGift : routes.digitalSubscriptionLanding;
const giftNonGiftLink = orderIsAGift ? routes.digitalSubscriptionLanding : routes.digitalSubscriptionLandingGift;

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
  trackProduct: 'DigitalPack',
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
        <CampaignHeaderGift countryGroupId={countryGroupId} promotionCopy={sanitisedPromoCopy} /> :
        <CampaignHeader countryGroupId={countryGroupId} promotionCopy={sanitisedPromoCopy} />
      }
      {countryGroupId === AUDCountries ?
        <ProductBlockAus
          countryGroupId={countryGroupId}
          accordionOpen={accordionOpen}
        /> :
        <ProductBlock
          countryGroupId={countryGroupId}
          accordionOpen={accordionOpen}
        />
      }
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <Prices orderIsAGift={orderIsAGift} />
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="white">
        <CentredContainer>
          <GiftNonGiftCta product="digital" href={giftNonGiftLink} orderIsAGift={orderIsAGift} />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  );

}

const content = (
  <Provider store={store}>
    <LandingPage />
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
