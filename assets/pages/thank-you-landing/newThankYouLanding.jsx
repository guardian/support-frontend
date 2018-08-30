// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { NewContributionHeader } from '../contributions-landing/new_components/ContributionHeader';

import { createPageReducerFor } from '../contributions-landing/contributionsLandingReducer';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-thank-you-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<NewContributionHeader />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>Thank you for your contribution to independent journalism</h1>

      <section class="confirmation confirmation--newsletter">
        <h3 class="confirmation__title">Subscriptions, membership and contributions</h3>
        <p>News and offers from The Guardian, The Observer and Guardian Weekly, on the ways to read and support our journalism. Already a member, subscriber or contributor, opt in here to receive your regular emails and updates.</p>
        <a class="button button--newsletter" href="#">Subscribe</a>
      </section>

      <section class="confirmation">
        <h2 class="confirmation__maintitle">
          <span class="hidden">Your contribution:</span>
          <span class="confirmation__amount">$25</span>
        </h2>
        <p class="confirmation__message">Look out for an email confirming your monthly recurring contribution</p>
      </section>

      <div class="confirmation confirmation--backtothegu">
        <a class="button button--wob" href="https://www.theguardian.com">
          Return to The Guardian&nbsp;
          <SvgArrowRight />  
        </a>
      </div>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
