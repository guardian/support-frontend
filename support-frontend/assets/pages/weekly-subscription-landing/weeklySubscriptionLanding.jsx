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
import type { State } from './weeklySubscriptionLandingReducer';
import reducer from './weeklySubscriptionLandingReducer';
import ConsentBanner from 'components/consentBanner/consentBanner';

import './weeklySubscriptionLanding.scss';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';

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
    <LargeParagraph>
      The Guardian Weekly magazine is a round-up of the world news,
      opinion and long reads that have shaped the week. Inside, the past seven days&#39;
      most memorable stories are reframed with striking photography and insightful companion
      pieces, all handpicked from The Guardian and The Observer.
    </LargeParagraph>);
};

const getCopy = (state: State): PageCopy => {
  const { promotionCopy } = state.page;
  const defaultTitle = 'Pause for thought with The Guardian\'s essential news magazine';
  return {
    title: promotionCopy && promotionCopy.title ? promotionCopy.title : defaultTitle,
    firstParagraph: getFirstParagraph(promotionCopy),
  };
};

// ----- Render ----- //

const copy = getCopy(store.getState());
const promoTerms = promotionTermsUrl(getQueryParameter(promoQueryParam) || '10ANNUAL');

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <CampaignHeader heading={copy.title} />
      <Content>
        <Text title="Catch up on the issues that matter">
          {copy.firstParagraph}
        </Text>
      </Content>
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
      <Content appearance="feature" id="subscribe">
        <Text title="Subscribe to Guardian Weekly today">
          <p>Choose how you’d like to pay</p>
        </Text>
        <WeeklyForm />
        <ProductPageInfoChip icon={<SvgGift />}>
              Gifting is available
        </ProductPageInfoChip>
        <ProductPageInfoChip icon={<SvgInformation />}>
              Delivery cost included. You can cancel your subscription at any time
        </ProductPageInfoChip>
      </Content>
      <Content>
        <Text title="Gift subscriptions">
          <LargeParagraph>A Guardian Weekly subscription makes a great gift.
            To&nbsp;buy&nbsp;one, just select the gift option at checkout or get in touch with your local customer
            service team:
          </LargeParagraph>
        </Text>
        <Outset>
          <ProductPageFeatures features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </Outset>
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
