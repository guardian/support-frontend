// @flow

// ----- Imports ----- //

import * as React from 'react';
import type { Element } from 'react';
import { Provider } from 'react-redux';
import marked from 'marked';
import DOMPurify from 'dompurify';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import WeeklyFooter from 'components/footerCompliant/WeeklyFooter';

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
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';

import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';

import 'stylesheets/skeleton/skeleton.scss';

import { WeeklyHero } from './components/hero/hero';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';

import WeeklyPrices from './components/weeklyProductPrices';
import reducer from './weeklySubscriptionLandingReducer';
import { giftHeroSubHeading } from './weeklySubscriptionLandingStyles';

import './weeklySubscriptionLanding.scss';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';

type PageCopy = {|
  title: string | React.Node,
  firstParagraph: React.Node,
  priceCardSubHeading: string,
|};

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);
const { orderIsAGift } = store.getState().page;

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'weekly-landing-page-uk',
  UnitedStates: 'weekly-landing-page-us',
  AUDCountries: 'weekly-landing-page-au',
  NZDCountries: 'weekly-landing-page-nz',
  EURCountries: 'weekly-landing-page-eu',
  Canada: 'weekly-landing-page-ca',
  International: 'weekly-landing-page-int',
};

const path = orderIsAGift ? routes.guardianWeeklySubscriptionLandingGift : routes.guardianWeeklySubscriptionLanding;
const giftNonGiftLink = orderIsAGift ?
  routes.guardianWeeklySubscriptionLanding : routes.guardianWeeklySubscriptionLandingGift;

const Header = headerWithCountrySwitcherContainer({
  path,
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    Canada,
    NZDCountries,
    International,
  ],
  trackProduct: 'GuardianWeekly',
});

const getSanitisedHtml = (description: string) =>
  // ensure we don't accidentally inject dangerous html into the page
  DOMPurify.sanitize(
    marked(description),
    { ALLOWED_TAGS: ['em', 'strong', 'ul', 'li', 'a', 'p'] },
  );

const getFirstParagraph = (promotionCopy: ?PromotionCopy) => {
  if (promotionCopy && promotionCopy.description) {
    const sanitised = getSanitisedHtml(promotionCopy.description);
    return (
    /* eslint-disable react/no-danger */
      <>
        <span
          className="promotion-description"
          dangerouslySetInnerHTML={
          { __html: sanitised }
        }
        />
      </>);
    /* eslint-enable react/no-danger */
  }
  if (orderIsAGift) {
    return (
      <>
        <h3 css={giftHeroSubHeading}>Stay on the same page, even when you’re apart</h3>
        <p>Share the gift of clarity with the Guardian Weekly magazine. A round-up of the world news, opinion and long
        reads that have shaped the week, all handpicked from The Guardian and The Observer.
        </p>
      </>
    );
  }
  return (
    <>
      The Guardian Weekly magazine is a round-up of the world news, opinion and long reads that have shaped the week.
      Inside, the past seven days' most memorable stories are reframed with striking photography and insightful
      companion pieces, all handpicked from The Guardian and The Observer.
    </>);
};

const getRegionalCopyFor = (region: CountryGroupId): Element<'span'> => (region === GBPCountries ?
  <span>Find clarity with The Guardian&apos;s global magazine</span> :
  <span>Read The Guardian in print</span>);

const getCopy = (promotionCopy: Object): PageCopy => {
  const currentRegion = detect();
  const defaultTitle = orderIsAGift ?
    null
    : getRegionalCopyFor(currentRegion);
  return {
    title: promotionCopy && promotionCopy.title ? promotionCopy.title : defaultTitle,
    firstParagraph: getFirstParagraph(promotionCopy),
    priceCardSubHeading: orderIsAGift ? 'Select a gift period' : 'Choose how you\'d like to pay',
  };
};

// ----- Render ----- //

const { promotionCopy } = store.getState().page;
const { internationalisation } = store.getState().common;
const copy = getCopy(promotionCopy);
const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
const promoTermsLink = promotionTermsUrl(getQueryParameter(promoQueryParam) || defaultPromo);

// ID for Selenium tests
const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

const content = (
  <Provider store={store}>
    <Page
      id={pageQaId}
      header={<Header />}
      footer={<WeeklyFooter centred promoTermsLink={promoTermsLink} />}
    >
      <WeeklyHero
        orderIsAGift={orderIsAGift}
        currencyId={internationalisation.currencyId}
        copy={{
          title: copy.title,
          paragraph: copy.firstParagraph,
        }}
      />
      <FullWidthContainer>
        <CentredContainer>
          <Block>
            {orderIsAGift ? <GiftBenefits /> : <Benefits />}
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <WeeklyPrices />
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="white">
        <CentredContainer>
          <GiftNonGiftCta product="Guardian Weekly" href={giftNonGiftLink} orderIsAGift={orderIsAGift} />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
