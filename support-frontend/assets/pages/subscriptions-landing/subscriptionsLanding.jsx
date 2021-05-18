// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import FooterContainer from 'components/footerCompliant/footerContainer';
import { AUDCountries, Canada, EURCountries, GBPCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import './subscriptionsLanding.scss';

import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import subscriptionsLandingReducer
  from 'pages/subscriptions-landing/subscriptionsLandingReducer';
import { subscriptionsLandingProps, type SubscriptionsLandingPropTypes } from './subscriptionsLandingProps';

// ----- Redux Store ----- //

const store = pageInit(() => subscriptionsLandingReducer(), true);

// ----- Render ----- //

const SubscriptionsLandingPage = ({
  countryGroupId,
  pricingCopy,
}: SubscriptionsLandingPropTypes) => {
  const Header = headerWithCountrySwitcherContainer({
    path: '/subscribe',
    countryGroupId,
    listOfCountryGroups: [
      GBPCountries,
      UnitedStates,
      AUDCountries,
      EURCountries,
      Canada,
      NZDCountries,
      International,
    ],
  });

  return (
    <Provider store={store}>
      <Page
        header={<Header />}
        footer={
          <FooterContainer faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions" centred />
        }
      >
        <SubscriptionLandingContent countryGroupId={countryGroupId} pricingCopy={pricingCopy} />
      </Page>
    </Provider>
  );
};

renderPage(<SubscriptionsLandingPage {...subscriptionsLandingProps} />, 'subscriptions-landing-page');
