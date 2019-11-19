// @flow

// ----- Imports ----- //

import * as React from 'react';
import { Provider } from 'react-redux';
import marked from 'marked';
import DOMPurify from 'dompurify';
import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import Footer from 'components/footer/footer';
import { List } from 'components/productPage/productPageList/productPageList';

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
import Content, { Outset } from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import ProductPageFeatures
  from 'components/productPage/productPageFeatures/productPageFeatures';
import ProductPageInfoChip
  from 'components/productPage/productPageInfoChip/productPageInfoChip';
import SvgInformation from 'components/svgs/information';
import SvgGift from 'components/svgs/gift';
import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/hero/hero';

import WeeklyForm from './components/weeklyForm';
import reducer from './weeklySubscriptionLandingReducer';
import ConsentBanner from 'components/consentBanner/consentBanner';

import './weeklySubscriptionLanding.scss';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import { promotionTermsUrl, routes } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';
import AnchorButton from 'components/button/anchorButton';

type PageCopy = {|
  title: string,
  firstParagraph: React.Node
|};

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);

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


const Header = headerWithCountrySwitcherContainer({
  path: '/subscribe/weekly',
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
      <LargeParagraph>
        <span
          className="promotion-description"
          dangerouslySetInnerHTML={
          { __html: sanitised }
        }
        />
      </LargeParagraph>);
    /* eslint-enable react/no-danger */
  }
  return (
    <LargeParagraph modifierClasses={['mobile-text-resize']}>
      The Guardian Weekly magazine is a round-up of the world news,
      opinion and long reads that have shaped the week. Inside, the past seven days&#39;
      most memorable stories are reframed with striking photography and insightful companion
      pieces, all handpicked from The Guardian and The Observer.
    </LargeParagraph>);
};

const getCopy = (promotionCopy: Object, orderIsAGift: boolean): PageCopy => {
  const defaultTitle = orderIsAGift ?
    'Give a gift that challenges the status quo'
    : 'Pause for thought with The Guardian\'s essential news magazine';
  return {
    title: promotionCopy && promotionCopy.title ? promotionCopy.title : defaultTitle,
    firstParagraph: getFirstParagraph(promotionCopy),
  };
};

// ----- Render ----- //

const { promotionCopy, orderIsAGift } = store.getState().page;
const copy = getCopy(promotionCopy, orderIsAGift);
const promoTerms = promotionTermsUrl(getQueryParameter(promoQueryParam) || '10ANNUAL');

type GiftHeadingPropTypes = {
  text: string,
}

const GiftHeading = (props: GiftHeadingPropTypes) => (
  <h2 className="component-text">{props.text}</h2>
);


const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <CampaignHeader heading={copy.title} orderIsAGift={orderIsAGift} />
      <Content>
        <Text title="Catch up on the issues that matter">
          {copy.firstParagraph}
        </Text>
      </Content>
      {!orderIsAGift &&
        <Content id="benefits">
          <Text title="As a subscriber you’ll enjoy" />
          <Outset>
            <ProductPageFeatures features={[
              { title: 'Every issue delivered with up to 35% off the cover price' },
              { title: 'Access to the magazine\'s digital archive' },
              { title: 'A weekly email newsletter from the editor' },
              { title: 'The very best of The Guardian\'s puzzles' },
            ]}
            />
          </Outset>
        </Content>
      }
      {orderIsAGift &&
        <Content id="gift-benefits-them">
          <GiftHeading text="What they'll get:" />
          <List items={[
            { explainer: 'The Guardian Weekly delivered, wherever they are in the world' },
            { explainer: 'The Guardian\'s global journalism to keep them informed' },
            { explainer: 'The very best of The Guardian\'s puzzles' },
          ]}
          />
        </Content>}
      {orderIsAGift &&
        <Content id="gift-benefits-you">
          <GiftHeading text="What you'll get:" />
          <List items={[
            { explainer: 'Your gift supports The Guardian\'s indpenedent journalism' },
            { explainer: 'Access to the magazine\'s digital archive' },
            { explainer: '35% off the cover price' },
          ]}
          />
        </Content>
      }
      <Content appearance="feature" id="subscribe">
        <Text title="Subscribe to Guardian Weekly today">
          <p>Choose how you’d like to pay</p>
        </Text>
        <WeeklyForm />
        {!orderIsAGift &&
          <ProductPageInfoChip icon={<SvgGift />}>
                Gifting is available
          </ProductPageInfoChip>
        }
        <ProductPageInfoChip icon={<SvgInformation />}>
              Delivery cost included. You can cancel your subscription at any time
        </ProductPageInfoChip>
      </Content>
      <Content>
        <Text title={orderIsAGift ? 'Looking for a personal subscription?' : 'Gift subscriptions'}>
          {!orderIsAGift && <LargeParagraph>A Guardian Weekly subscription makes a great gift.</LargeParagraph>}
        </Text>
        <AnchorButton
          modifierClasses={['with-margin-bottom']}
          appearance="blue"
          href={orderIsAGift ? routes.guardianWeeklySubscriptionLanding : routes.guardianWeeklySubscriptionLandingGift}
        >
          {orderIsAGift ? 'See all subscriptions' : 'See all gift subscriptions'}
        </AnchorButton>
      </Content>
      <Content>
        <Text title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full annual promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={promoTerms}>here</a>.
          </p>
        </Text>
        <Text title="Guardian Weekly terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Weekly print subscription services and their terms and conditions, see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions">here</a>.
          </p>
        </Text>
      </Content>
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
