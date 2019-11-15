// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

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
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import { campaigns, getCampaignName } from 'helpers/campaigns';
import { init as formInit } from './contributionsLandingInit';
import { initReducer } from './contributionsLandingReducer';
import { ContributionFormContainer } from './components/ContributionFormContainer';
import { enableOrDisableForm } from './checkoutFormIsSubmittableActions';
import ContributionThankYouContainer
  from './components/ContributionThankYou/ContributionThankYouContainer';
import { setUserStateActions } from './setUserStateActions';
import ConsentBanner from '../../components/consentBanner/consentBanner';
import SecureTransactionIndicator from '../../../assets/components/secureTransactionIndicator/secureTransactionIndicator';
import './contributionsLanding.scss';
import './contributionsLandingEOY2019.scss';
import type { NewLandingPageTemplateTestVariants } from '../../../assets/helpers/abTests/abtestDefinitions';
import './newTemplate.scss';

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

const campaignName = getCampaignName();

const cssModifiers = campaignName && campaigns[campaignName] && campaigns[campaignName].cssModifiers ?
  campaigns[campaignName].cssModifiers : [];

const backgroundImageSrc = campaignName && campaigns[campaignName] && campaigns[campaignName].backgroundImage ?
  campaigns[campaignName].backgroundImage : null;

const showSecureTransactionIndicator = () => {
  if (countryGroupId === 'GBPCountries') {
    return <SecureTransactionIndicator modifierClasses={['top']} />;
  } else if (store.getState().common.abParticipations.paymentSecuritySecureTransactionGreyNonUK === 'V1_securetransactiongrey') {
    return <SecureTransactionIndicator modifierClasses={['top', 'hideaftermobile']} />;
  }
  return null;
};

const newTemplateVariant: NewLandingPageTemplateTestVariants =
  store.getState().common.abParticipations.newLandingPageTemplateTest;


const originalPage = (campaignCodeParameter: ?string) => (
  <Page
    classModifiers={['contribution-form', ...cssModifiers]}
    header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
    footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    backgroundImageSrc={backgroundImageSrc}
  >
    {showSecureTransactionIndicator}
    <ContributionFormContainer
      thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
      campaignCodeParameter={campaignCodeParameter}
    />
    <ConsentBanner />
  </Page>
);

const newTemplagePage = (campaignCodeParameter: ?string) => (
  <Page
    classModifiers={['new-template']}
    header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
    footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    backgroundImageSrc={backgroundImageSrc}
  >
    {showSecureTransactionIndicator}
    <ContributionFormContainer
      thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
      campaignCodeParameter={campaignCodeParameter}
    />
    <ConsentBanner />
  </Page>
);


function contributionsLandingPage(campaignCodeParameter: ?string) {
<<<<<<< HEAD
  return (
    <Page
      classModifiers={['contribution-form', ...cssModifiers]}
      header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
      backgroundImageSrc={backgroundImageSrc}
    >
      {showSecureTransactionIndicator()}
      <ContributionFormContainer
        thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
        campaignCodeParameter={campaignCodeParameter}
      />
      <ConsentBanner />
    </Page>
  );
=======
  return newTemplateVariant === 'new_template' ? newTemplagePage(campaignCodeParameter) : originalPage(campaignCodeParameter);
>>>>>>> set up test in landing page
}

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute/"
          render={() => contributionsLandingPage()
          }
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute/:campaignCode"
          render={props => contributionsLandingPage(props.match.params.campaignCode)
          }
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
              </Page>
            );
          }}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, reactElementId, () => store.dispatch(enableOrDisableForm()));
