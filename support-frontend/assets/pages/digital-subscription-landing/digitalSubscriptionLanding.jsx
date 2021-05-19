// @flow

// ----- Imports ----- //

import { renderPage } from 'helpers/render';
import React from 'react';
import { css } from '@emotion/core';
import { from, until } from '@guardian/src-foundations/mq';

import {
  AUDCountries,
  Canada,
  type CountryGroupId,
  EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { routes } from 'helpers/routes';
import { useHasBeenSeen } from 'helpers/useHasBeenSeen';

import Page from 'components/page/page';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';

import { getPromotionCopy } from 'helpers/productPrice/promotions';

import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import { DigitalHero } from './components/hero/hero';
import ProductBlock from './components/productBlock/productBlock';
import ProductBlockAus from './components/productBlock/productBlockAus';
import Prices from './components/prices';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import DigitalFooter from 'components/footerCompliant/DigitalFooter';
import FeedbackWidget from 'pages/digital-subscription-landing/components/feedbackWidget/feedbackWidget';
import { getHeroCtaProps } from './components/paymentSelection/helpers/paymentSelection';

import { digitalLandingProps, type DigitalLandingPropTypes } from './digitalSubscriptionLandingProps';

// ----- Styles ----- //
import 'stylesheets/skeleton/skeleton.scss';

const productBlockContainer = css`
  ${until.tablet} {
    margin-top: 0;
    padding-top: 0;
  }

  ${from.tablet} {
    margin-top: 66px;
  }
`;

// ----- Internationalisation ----- //

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


// ----- Render ----- //
function DigitalLandingPage({
  countryGroupId,
  currencyId,
  participations,
  productPrices,
  promotionCopy,
  orderIsAGift,
}: DigitalLandingPropTypes) {
  if (!productPrices) {
    return null;
  }

  const isGift = orderIsAGift || false;
  const showPriceCardsInHero = participations.priceCardsInHeroTest === 'variant';

  const path = orderIsAGift ? routes.digitalSubscriptionLandingGift : routes.digitalSubscriptionLanding;
  const giftNonGiftLink = orderIsAGift ? routes.digitalSubscriptionLanding : routes.digitalSubscriptionLandingGift;
  const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

  // For CTAs in hero test
  const heroPriceList = getHeroCtaProps(
    productPrices,
    currencyId,
    countryGroupId,
  );

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

  const [widgetShouldDisplay, setElementToObserve] = useHasBeenSeen({
    threshold: 0.3,
    debounce: true,
  });

  const footer = (
    <div className="footer-container">
      <div className="footer-alignment">
        <DigitalFooter
          country={countryGroupId}
          orderIsAGift={isGift}
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
      <DigitalHero
        orderIsAGift={isGift}
        countryGroupId={countryGroupId}
        promotionCopy={sanitisedPromoCopy}
        showPriceCards={showPriceCardsInHero}
        priceList={heroPriceList}
      />
      <FullWidthContainer>
        <CentredContainer>
          <Block cssOverrides={productBlockContainer}>
            <div ref={setElementToObserve}>
              {countryGroupId === AUDCountries ?
                <ProductBlockAus
                  countryGroupId={countryGroupId}
                /> :
                <ProductBlock
                  countryGroupId={countryGroupId}
                />
              }
            </div>
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <Prices
            countryGroupId={countryGroupId}
            currencyId={currencyId}
            productPrices={productPrices}
            orderIsAGift={isGift}
          />
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="white">
        <CentredContainer>
          <GiftNonGiftCta product="digital" href={giftNonGiftLink} orderIsAGift={isGift} />
        </CentredContainer>
      </FullWidthContainer>
      <FeedbackWidget display={widgetShouldDisplay} />
    </Page>
  );
}

renderPage(<DigitalLandingPage {...digitalLandingProps} />, reactElementId[digitalLandingProps.countryGroupId]);
