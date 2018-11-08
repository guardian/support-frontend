// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import Footer from 'components/footer/footer';

import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import SvgChevron from 'components/svgs/chevron';

import WeeklyContentBlock from './components/weeklyContentBlock';
import WeeklyTextBlock from './components/weeklyTextBlock';
import WeeklyFeatureList from './components/weeklyFeatureList';
import WeeklyHero from './components/weeklyHero';
import WeeklyForm from './components/weeklyForm';
import WeeklyCta from './components/weeklyCta';
import reducer from './weeklySubscriptionLandingReducer';

// ----- Redux Store ----- //

const store = pageInit(reducer, true);

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
      <WeeklyHero
        headline="The essential new Weekly magazine from The&nbsp;Guardian"
        overheading="The Guardian Weekly subscriptions"
        heading="Seven days of international news curated to give you a clearer global perspective."
        cta={<WeeklyCta icon={<SvgChevron />} href="#subscribe">See Subscription options</WeeklyCta>}
      />
      <WeeklyContentBlock>
        <WeeklyTextBlock title="Open up your world view, Weekly">
          <p>Inside the magazine you’ll find quality, independent journalism including opinion,
          insight, culture and access to new puzzles each week. Subscribe today and get an
          expert view on some of the most challenging issues of today, as well as free delivery,
          wherever you are in the world
          </p>
        </WeeklyTextBlock>
      </WeeklyContentBlock>
      <WeeklyContentBlock type="grey">
        <WeeklyTextBlock title="As a subscriber you’ll enjoy" />
        <WeeklyFeatureList features={[
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
      ]}
        />
      </WeeklyContentBlock>
      <WeeklyContentBlock type="feature" id="subscribe">
        <WeeklyTextBlock title="Get your Guardian Weekly, subscribe now">
          <p>How would you like to pay for your Guardian Weekly?</p>
        </WeeklyTextBlock>
        <WeeklyForm />
      </WeeklyContentBlock>
      <WeeklyContentBlock type="grey">
        <WeeklyTextBlock title="Buying as a gift?">
          <p>If you’d like to buy a Guardian Weekly subscription as a gift,
          just get in touch with your local customer service team.
          </p>
        </WeeklyTextBlock>
        <WeeklyFeatureList features={[
        { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
        { title: 'Australia and New Zealand', copy: '+44 (0) 330 333 6767' },
        { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
      ]}
        />

      </WeeklyContentBlock>
      <WeeklyContentBlock type="white">
        <WeeklyTextBlock title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited
          (&quot;GNM&quot;) reserves the right to withdraw this promotion
          at any time. View full promotion terms and conditions here.
          </p>
        </WeeklyTextBlock>
        <WeeklyTextBlock title="Guardian Weekly terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited
          (&quot;GNM&quot;) reserves the right to withdraw this promotion
          at any time. View full promotion terms and conditions here.
          </p>
        </WeeklyTextBlock>
      </WeeklyContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
