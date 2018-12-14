// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import countrySwitcherHeaderContainerWithTracking from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainerWithTracking';
import Footer from 'components/footer/footer';

import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import GridImage from 'components/gridImage/gridImage';
import SvgChevron from 'components/svgs/chevron';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageContentBlockOutset from 'components/productPage/productPageContentBlock/productPageContentBlockOutset';
import ProductPageTextBlock, { largeParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageButton from 'components/productPage/productPageButton/productPageButton';
import ProductPageFeatures from 'components/productPage/productPageFeatures/productPageFeatures';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';

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

const CountrySwitcherHeader = countrySwitcherHeaderContainerWithTracking(
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
      header={<CountrySwitcherHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        headline="Become a Guardian Weekly subscriber"
        overheading="Guardian Weekly subscriptions"
        heading="Get a clearer, global perspective on the issues that matter, in one magazine."
        modifierClasses={['weekly']}
        cta={<ProductPageButton trackingOnClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</ProductPageButton>}
      >
        <GridImage
          gridId="weeklyLandingHero"
          srcSizes={[946, 473]}
          sizes="(max-width: 740px) 90vw, 600px"
          imgType="png"
        />
      </ProductPagehero>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Open up your world view, Weekly">
          <p className={largeParagraphClassName}>Inside the essential magazine from
          The&nbsp;Guardian, you&rsquo;ll find expert opinion, insight and culture, curated to
          bring you a progressive, international perspective. You&rsquo;ll also discover
          challenging new puzzles every week. Subscribe today and get free delivery, worldwide.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock id="benefits">
        <ProductPageTextBlock title="As a subscriber you’ll enjoy" />
        <ProductPageContentBlockOutset>
          <ProductPageFeatures features={[
            { title: 'Up to 35% off the retail cover price' },
            { title: 'Free international shipping' },
            { title: 'A weekly email newsletter from the editor' },
            { title: 'Access to every edition on any device, through PressReader' },
          ]}
          />
        </ProductPageContentBlockOutset>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" id="subscribe">
        <ProductPageTextBlock title="Subscribe to Guardian Weekly today">
          <p>Choose how you’d like to pay</p>
        </ProductPageTextBlock>
        <WeeklyForm />
        <ProductPageInfoChip>
          <span class="component-product-page-info-chip__gifting-info">
            <svg class="component-product-page-info-chip__gifting-info-svg" version="1.1">
              <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="GIFT" transform="translate(0.000000, -1.000000)" fill="#FFFFFF" fill-rule="nonzero">
                  <g id="Gift-SVG" transform="translate(1.000000, 1.000000)">
                    <path d="M3.50585793,4.35813426 C4.42633252,4.35813426 5.25966585,3.73575368 6.00585793,2.49099253 L3.01141,0.1 L2.263992,0.1 L1.666364,2.49099253 L2.1,2.82809616 C2.82195248,4.35818216 2.62390512,4.35813426 3.50585793,4.35813426 Z" id="Oval-Copy"></path>
                    <path d="M9.805858,4.35813426 C10.7263326,4.35813426 11.5596659,3.73575368 12.305858,2.49099253 L9.511411,0.1 L8.663992,0.1 L8.066364,2.46271893 L8,2.82809616 C8.72195248,4.35818216 8.92390519,4.35813426 9.805858,4.35813426 Z" id="Oval-Copy-2" transform="translate(10.152929, 2.229067) scale(-1, 1) translate(-10.152929, -2.229067) "></path>
                    <path d="M5.5,6.7 L5.68434189e-14,6.7 L5.68434189e-14,3.5 L0.5,3 L5.5,3 L5.5,6.7 Z M5.5,9.4 L5.5,17 L1,17 L0.5,16.5 L0.5,9.4 L5.5,9.4 Z M14,6.7 L8.5,6.7 L8.5,3 L13.5,3 L14,3.5 L14,6.7 Z M13.5,9.4 L13.5,16.5 L13,17 L8.5,17 L8.5,9.4 L13.5,9.4 Z" id="Combined-Shape" stroke="#FFFFFF"></path>
                  </g>
                </g>
              </g>
            </svg>
            <span class="component-product-page-info-chip__gifting-info-text">
              Gifting is available for quarterly and annual subscriptions
            </span>
          </span>
          <span class="component-product-page-info-chip__cancel-info">
            <svg class="component-product-page-info-chip__cancel-info-svg" version="1.1">
              <g id="Information-SVG" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Group-4">
                  <circle id="Oval" fill="#FFFFFF" fill-rule="nonzero" cx="8" cy="8" r="8"></circle>
                  <path d="M8.79121082,4.84545455 C7.91535223,4.84545455 7.44373607,4.2660404 7.44373607,3.63272727 C7.44373607,2.86466667 8.09052395,2.42 8.79121082,2.42 C9.6940189,2.42 10.1521603,2.98593939 10.1521603,3.64620202 C10.1521603,4.41426263 9.50537243,4.84545455 8.79121082,4.84545455 Z M7.0260189,13.092 C5.9480391,13.092 5.6650694,12.5799596 5.89414011,11.5693535 L7.05296839,6.55674747 L6.01541284,6.58369697 L6.13668556,5.8830101 C6.91822092,5.64046465 8.00967546,5.41139394 8.65646334,5.41139394 C9.46494819,5.41139394 9.70749364,5.81563636 9.50537243,6.65107071 L8.26569566,12.0005455 L9.50537243,11.9466465 L9.30325122,12.6203838 C8.68341284,12.9168283 7.80755425,13.092 7.0260189,13.092 Z" id="i" fill="#052962"></path>
                </g>
              </g>
            </svg>
            <span class="component-product-page-info-chip__cancel-info-text">
              You can cancel your subscription at any time
            </span>
          </span>
        </ProductPageInfoChip>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Gift subscriptions">
          <p className={largeParagraphClassName}>A quarterly or annual Guardian Weekly subscription makes a great gift.
            To&nbsp;buy&nbsp;one, just select the gift option at checkout or get in touch with your local customer
            service team:
          </p>
        </ProductPageTextBlock>
        <ProductPageContentBlockOutset>
          <ProductPageFeatures features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </ProductPageContentBlockOutset>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full promotion terms and conditions visit <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/WWM99X/terms?country=${subsCountry}`}>subscribe.theguardian.com/p/WWM99X/terms</a>
          </p>
        </ProductPageTextBlock>
        <ProductPageTextBlock title="Guardian Weekly terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Weekly print subscription services and their terms and conditions - see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions">theguardian.com/guardian-weekly-subscription-terms-conditions</a>
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
