// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { isDetailsSupported, polyfillDetails } from 'helpers/details';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import {
  type CountryGroupId,
  countryGroups,
  detect,
} from 'helpers/internationalisation/countryGroup';
import * as user from 'helpers/user/user';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import * as storage from 'helpers/storage';
import { set as setCookie } from 'helpers/cookie';
import Page from 'components/page/page';
import ContributionsFooter from 'components/footerCompliant/ContributionsFooter';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import { getCampaignSettings } from 'helpers/campaigns';
import { init as formInit } from './contributionsLandingInit';
import { initReducer } from './contributionsLandingReducer';
import { ContributionFormContainer } from './components/ContributionFormContainer';
import { enableOrDisableForm } from './checkoutFormIsSubmittableActions';
import ContributionThankYouPage from './components/ContributionThankYou/ContributionThankYouPage';
import { setUserStateActions } from './setUserStateActions';
import './contributionsLanding.scss';
import './newContributionsLandingTemplate.scss';
import { FocusStyleManager } from '@guardian/src-utilities';
import { localCurrencyCountries } from '../../helpers/internationalisation/localCurrencyCountry';
import type { LocalCurrencyCountry } from '../../helpers/internationalisation/localCurrencyCountry';


if (!isDetailsSupported) {
  polyfillDetails();
}

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(() => initReducer(), true);

if (!window.guardian.polyfillScriptLoaded) {
  gaEvent({
    category: 'polyfill',
    action: 'not loaded',
    label: window.guardian.polyfillVersion || '',
  });
}

if (typeof Object.values !== 'function') {
  gaEvent({
    category: 'polyfill',
    action: 'Object.values not available after polyfill',
    label: window.guardian.polyfillVersion || '',
  });
}

// We need to initialise in this order, as
// formInit depends on the user being populated
user.init(store.dispatch, setUserStateActions(countryGroupId));
formInit(store);


const reactElementId = `contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const ONE_OFF_CONTRIBUTION_COOKIE = 'gu.contributions.contrib-timestamp';
const currentTimeInEpochMilliseconds: number = Date.now();
const cookieDaysToLive = 365;

const setOneOffContributionCookie = () => {
  setCookie(
    ONE_OFF_CONTRIBUTION_COOKIE,
    currentTimeInEpochMilliseconds.toString(),
    cookieDaysToLive,
  );
};

const campaignSettings = getCampaignSettings();

const cssModifiers = campaignSettings && campaignSettings.cssModifiers ?
  campaignSettings.cssModifiers : [];

const backgroundImageSrc = campaignSettings && campaignSettings.backgroundImage ?
  campaignSettings.backgroundImage : null;

FocusStyleManager.onlyShowFocusOnTabs(); // https://www.theguardian.design/2a1e5182b/p/6691bb-accessibility

type ContributionsLandingPageProps = {
  campaignCodeParameter: ?string,
  localCurrencyCountry: ?LocalCurrencyCountry,
}
const contributionsLandingPage = (props: ContributionsLandingPageProps) => (
  <Page
    classModifiers={['new-template', 'contribution-form', ...cssModifiers]}
    header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
    footer={<ContributionsFooter />}
    backgroundImageSrc={backgroundImageSrc}
  >
    <ContributionFormContainer
      thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
      campaignCodeParameter={props.campaignCodeParameter}
      localCurrencyCountry={props.localCurrencyCountry}
    />
  </Page>
);

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute/"
          render={(props) => {
            const { search } = props.location;
            const queryParams = new URLSearchParams(search);
            const localCurrencyCountryId = queryParams.get('local-currency-country-id');
            const localCurrencyCountry = localCurrencyCountries[localCurrencyCountryId];

            return contributionsLandingPage({
              campaignCodeParameter: null,
              localCurrencyCountry,
            });
          }}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute/:campaignCode"
          render={(props) => {
            const { search } = props.location;
            const queryParams = new URLSearchParams(search);
            const localCurrencyCountryId = queryParams.get('local-currency-country-id');
            const campaignCodeParameter = props.match.params.campaignCode;
            const localCurrencyCountry = localCurrencyCountries[localCurrencyCountryId];

            return contributionsLandingPage({
              campaignCodeParameter,
              localCurrencyCountry,
            });
          }}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/thankyou"
          render={(props) => {
            const paymentMethod = storage.getSession('selectedPaymentMethod');
            const isPaymentMethodSelected = paymentMethod && paymentMethod !== 'None';

            const { pathname, search } = props.location;
            const queryParams = new URLSearchParams(search);

            if (!isPaymentMethodSelected && !queryParams.has('no-redirect')) {
              const redirectPath = pathname.replace('thankyou', 'contribute') + search;
              return <Redirect to={redirectPath} push={false} />;
            }

            // we set the recurring cookie server side
            if (storage.getSession('selectedContributionType') === 'ONE_OFF') {
              setOneOffContributionCookie();
            }
            return (
              <ContributionThankYouPage countryGroupId={countryGroupId} />
            );
          }}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, reactElementId, () => store.dispatch(enableOrDisableForm()));
