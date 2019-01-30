// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Footer from 'components/footer/footer';

import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import GridPicture from 'components/gridPicture/gridPicture';
import SvgChevron from 'components/svgs/chevron';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock, { Outset } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import AnchorButton from 'components/button/anchorButton';
import ProductPageFeatures from 'components/productPage/productPageFeatures/productPageFeatures';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import SvgInformation from 'components/svgs/information';
import SvgGift from 'components/svgs/gift';

import WeeklyForm from './components/weeklyForm';
import reducer from './weeklySubscriptionLandingReducer';

import './weeklySubscriptionLanding.scss';

// ----- Redux Store ----- //

const store = pageInit(reducer, true);

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();
const { supportInternationalisationId } = countryGroups[countryGroupId];
const subsCountry = (['us', 'au'].includes(supportInternationalisationId) ? supportInternationalisationId : 'gb').toUpperCase();

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


const Header = headerWithCountrySwitcherContainer(
  '/subscribe/weekly',
  [
    'GBPCountries',
    'UnitedStates',
    'AUDCountries',
    'EURCountries',
    'Canada',
    'NZDCountries',
    'International',
  ],
  'GuardianWeekly',
);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <ProductPagehero
        appearance="feature"
        overheading="Guardian Weekly subscriptions"
        heading="Get a clearer, global perspective on the issues that matter, in one magazine."
        modifierClasses={['weekly']}
        cta={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
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

      </ProductPagehero>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Open up your world view, Weekly">
          <LargeParagraph>Inside the essential magazine from
          The&nbsp;Guardian, you&rsquo;ll find expert opinion, insight and culture, curated to
          bring you a progressive, international perspective. You&rsquo;ll also discover
          challenging new puzzles every week. Subscribe today and get free delivery, worldwide.
          </LargeParagraph>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock id="benefits">
        <ProductPageTextBlock title="As a subscriber you’ll enjoy" />
        <Outset>
          <ProductPageFeatures features={[
            { title: 'Up to 35% off the retail cover price' },
            { title: 'Free international shipping' },
            { title: 'A weekly email newsletter from the editor' },
            { title: 'Access to every edition on any device, through PressReader' },
          ]}
          />
        </Outset>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" id="subscribe">
        <ProductPageTextBlock title="Subscribe to Guardian Weekly today">
          <p>Choose how you’d like to pay</p>
        </ProductPageTextBlock>
        <WeeklyForm />
        <ProductPageInfoChip icon={<SvgGift />}>
              Gifting is available for quarterly and annual subscriptions
        </ProductPageInfoChip>
        <ProductPageInfoChip icon={<SvgInformation />}>
              You can cancel your subscription at any time
        </ProductPageInfoChip>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Gift subscriptions">
          <LargeParagraph>A quarterly or annual Guardian Weekly subscription makes a great gift.
            To&nbsp;buy&nbsp;one, just select the gift option at checkout or get in touch with your local customer
            service team:
          </LargeParagraph>
        </ProductPageTextBlock>
        <Outset>
          <ProductPageFeatures features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </Outset>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full 6 for 6 promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/WWM99X/terms?country=${subsCountry}`}>here</a>.
          </p>
        </ProductPageTextBlock>
        <ProductPageTextBlock title="Guardian Weekly terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Weekly print subscription services and their terms and conditions, see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions">here</a>.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
