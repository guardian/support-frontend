// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ProgressMessage from 'components/progressMessage/progressMessage';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import { type IsoCurrency, detect as detectCurrency } from 'helpers/internationalisation/currency';
import * as user from 'helpers/user/user';
import { set as setCookie } from 'helpers/cookie';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

import { NewHeader } from 'components/headers/new-header/Header';
import { NewContributionForm } from './components/ContributionForm';
import { NewContributionThanks } from './components/ContributionThanks';
import { NewContributionBackground } from './components/ContributionBackground';

import { initReducer } from './contributionsLandingReducer';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const currency: IsoCurrency = detectCurrency(countryGroupId);

const store = pageInit(initReducer(countryGroupId));

user.init(store.dispatch);

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];
const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const ONE_OFF_CONTRIBUTION_COOKIE = 'gu.contributions.contrib-timestamp';
const currentTimeInEpochMilliseconds: number = Date.now();

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute.new"
          render={() => (
            <Page
              classModifiers={['contribution-form']}
              header={<NewHeader selectedCountryGroup={selectedCountryGroup} />}
              footer={<Footer disclaimer countryGroupId={countryGroupId} />}
            >
              <NewContributionForm
                countryGroupId={countryGroupId}
                currency={currency}
                selectedCountryGroupDetails={selectedCountryGroupDetails}
                thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou.new`}
              />
              <NewContributionBackground />
            </Page>
          )}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/thankyou.new"
          render={() => {
            setCookie(
              ONE_OFF_CONTRIBUTION_COOKIE,
              currentTimeInEpochMilliseconds.toString(),
            );
            return (
              <Page
                classModifiers={['contribution-thankyou']}
                header={<NewHeader />}
                footer={<Footer disclaimer countryGroupId={countryGroupId} />}
              >
                <NewContributionThanks
                  countryGroupId={countryGroupId}
                  currency={currency}
                />
                <NewContributionBackground />
              </Page>
            );
          }}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, reactElementId);
