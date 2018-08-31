// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { classNameWithModifiers } from 'helpers/utilities';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import SvgArrowRight from 'components/svgs/arrowRightStraight';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgNewsletters from 'components/svgs/newsletters';
import { NewHeader } from 'components/headers/new-header/Header';
import { createPageReducerFor } from '../contributions-landing/contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-contributions-thank-you-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<NewHeader />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>Thank you for your contribution to independent journalism</h1>

      <section className={classNameWithModifiers('confirmation', ['newsletter'])}>
        <h3 className="confirmation__title">Subscriptions, membership and contributions</h3>
        <p>News and offers from The Guardian, The Observer and Guardian Weekly,
          on the ways to read and support our journalism. Already a member, subscriber or
          contributor, opt in here to receive your regular emails and updates.
        </p>
        <a className={classNameWithModifiers('button', ['newsletter'])} href="/subscribe">
          <SvgSubscribe />
          Subscribe
        </a>
        <SvgNewsletters />
      </section>

      <section className="confirmation">
        <h2 className="confirmation__maintitle">
          <span className="hidden">Your contribution:</span>
          <span className="confirmation__amount">$25</span>
        </h2>
        <p className="confirmation__message">Look out for an email confirming your monthly recurring contribution</p>
      </section>

      <div className={classNameWithModifiers('confirmation', ['backtothegu'])}>
        <a className={classNameWithModifiers('button', ['wob'])} href="https://www.theguardian.com">
          Return to The Guardian&nbsp;
          <SvgArrowRight />
        </a>
      </div>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
