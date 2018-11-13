// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import Footer from 'components/footer/footer';

import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import GridImage from 'components/gridImage/gridImage';
import SvgChevron from 'components/svgs/chevron';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageContentBlockOutset from 'components/productPage/productPageContentBlock/productPageContentBlockOutset';
import ProductPageTextBlock, { largeParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';

import WeeklyFeatureList from './components/weeklyFeatureList';
import WeeklyForm from './components/weeklyForm';
import WeeklyCta from './components/weeklyCta';
import reducer from './weeklySubscriptionLandingReducer';

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

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
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
);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        headline="The essential new Weekly magazine from The&nbsp;Guardian"
        overheading="The Guardian Weekly subscriptions"
        heading="Seven days of international news curated to give you a clearer global perspective."
        modifierClasses={['weekly']}
        cta={<WeeklyCta icon={<SvgChevron />} href="#subscribe">See Subscription options</WeeklyCta>}
      >
        <GridImage
          gridId="weeklyLandingHero"
          srcSizes={[1000, 500]}
          sizes="(max-width: 740px) 90vw, 600px"
          imgType="png"
        />
      </ProductPagehero>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Open up your world view, Weekly">
          <p className={largeParagraphClassName}>Inside the magazine you’ll find quality, independent journalism
            including opinion, insight, culture and access to new puzzles each week.
            Subscribe today and get an expert view on some of the most challenging
            issues of today, as well as free delivery, wherever you are in the world.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="As a subscriber you’ll enjoy" />
        <ProductPageContentBlockOutset>
          <WeeklyFeatureList features={[
            { title: 'Up to 30% off the retail cover price' },
            { title: 'Free international shipping' },
            { title: 'A weekly email newsletter from the editor' },
            { title: 'Access to all editions at any time, on any device, through PressReader.' },
          ]}
          />
        </ProductPageContentBlockOutset>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" id="subscribe">
        <ProductPageTextBlock title="Get your Guardian Weekly, subscribe now">
          <p>How would you like to pay for your Guardian Weekly?</p>
        </ProductPageTextBlock>
        <WeeklyForm />
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Buying as a gift?">
          <p className={largeParagraphClassName}>If you’d like to buy a Guardian Weekly subscription as a gift,
          just get in touch with your local customer service team.
          </p>
        </ProductPageTextBlock>
        <ProductPageContentBlockOutset>
          <WeeklyFeatureList features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </ProductPageContentBlockOutset>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Promotion terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Weekly print subscription services and their terms and conditions - see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions">here</a>
          </p>
        </ProductPageTextBlock>
        <ProductPageTextBlock title="Guardian Weekly terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&quot;GNM&quot;) reserves the right to withdraw this promotion at any time. For full promotion terms and conditions see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/WWM99X/terms?country=${subsCountry}`}>here</a>.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
