// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { isDetailsSupported, polyfillDetails } from 'helpers/details';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import * as user from 'helpers/user/user';
import * as storage from 'helpers/storage';
import { set as setCookie } from 'helpers/cookie';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';

import { init as formInit } from './contributionsLandingInit';
import { initReducer } from './contributionsLandingReducer';
import { NewContributionFormContainer } from './components/ContributionFormContainer';
import { enableOrDisableForm } from './checkoutFormIsSubmittableActions';
import ContributionThankYouContainer from './components/ContributionThankYou/ContributionThankYouContainer';
import { NewContributionBackground } from './components/ContributionBackground';
import { setUserStateActions } from './setUserStateActions';

if (!isDetailsSupported) {
  polyfillDetails();
}

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(initReducer(countryGroupId), true);
// We need to initialise in this order, as
// formInit depends on the user being populated
user.init(store.dispatch, setUserStateActions);
formInit(store);


const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const ONE_OFF_CONTRIBUTION_COOKIE = 'gu.contributions.contrib-timestamp';
const currentTimeInEpochMilliseconds: number = Date.now();

const setOneOffContributionCookie = () => {
  setCookie(
    ONE_OFF_CONTRIBUTION_COOKIE,
    currentTimeInEpochMilliseconds.toString(),
  );
};

const ContributionLandingPage = (
  <Page
    classModifiers={['contribution-form']}
    header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
    footer={<Footer disclaimer countryGroupId={countryGroupId} />}
  >
    <NewContributionFormContainer
      thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
    />
    <NewContributionBackground />
  </Page>
);

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute"
          render={() => ContributionLandingPage}
        />
        {/* this is just an alias for the above, so we can do a dummy A/A redirect test in Optimize */ }
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/o/contribute"
          render={() => ContributionLandingPage}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/thankyou"
          render={() => {
            // we set the recurring cookie server side
            if (storage.getSession('selectedContributionType') === 'ONE_OFF') {
              setOneOffContributionCookie();
            }
            return (
              <Page
                classModifiers={['contribution-thankyou']}
                header={<RoundelHeader />}
                footer={<Footer disclaimer countryGroupId={countryGroupId} />}
              >
                <ContributionThankYouContainer />
                <NewContributionBackground />
              </Page>
            );
          }}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, reactElementId, () => store.dispatch(enableOrDisableForm()));
