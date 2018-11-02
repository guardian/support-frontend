// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


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
    <div className="weekly-subscription-landing-header">
      <LeftMarginSection>
        <HeadingBlock overheading="The Guardian Weekly subscriptions" heading="Seven days of international news curated to give you a clearer global perspective." />
      </LeftMarginSection>
    </div>
    <div className="weekly-subscription-underheader">
      <LeftMarginSection>
        <div className="weekly-subscription-underheader__cta">
        See Subscription options
        </div>
      </LeftMarginSection>
    </div>
  </Page>
);

renderPage(content, reactElementId[countryGroupId]);
