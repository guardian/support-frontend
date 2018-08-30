// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

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
      header={<NewContributionHeader selectedCountryGroup={selectedCountryGroup} />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
