// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import WeeklyContentBlock from './components/weeklyContentBlock';
import WeeklyTextBlock from './components/weeklyTextBlock';
import WeeklyFeatureList from './components/weeklyFeatureList';
import WeeklyHero from './components/weeklyHero';
import WeeklyForm from './components/weeklyForm';


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

// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <Page
    header={<SimpleHeader />}
    footer={<Footer />}
  >
    <WeeklyHero />
    <WeeklyContentBlock>
      <WeeklyTextBlock title="Open up your world view, Weekly">
        <p>Inside the magazine you’ll find quality, independent journalism including opinion,
          insight, culture and access to new puzzles each week. Subscribe today and get an
          expert view on some of the most challenging issues of today, as well as free delivery,
          wherever you are in the world
        </p>
      </WeeklyTextBlock>
    </WeeklyContentBlock>
    <WeeklyContentBlock type="feature">
      <WeeklyTextBlock title="As a subscriber you’ll enjoy" />
      <WeeklyFeatureList features={[
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
        { title: 'Up to 30% off the retail cover price' },
      ]}
      />
    </WeeklyContentBlock>
    <WeeklyContentBlock type="grey">
      <WeeklyTextBlock title="Get your Guardian Weekly, subscribe now">
        <p>How would you like to pay for your Guardian Weekly?</p>
      </WeeklyTextBlock>
      <WeeklyForm />
    </WeeklyContentBlock>
    <WeeklyContentBlock type="white">
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
    <WeeklyContentBlock type="dark">
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
);

renderPage(content, reactElementId[countryGroupId]);
