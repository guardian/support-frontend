// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import Footer from 'components/footerCompliant/Footer';
import { AUDCountries, Canada, EURCountries, GBPCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';

import { renderPage } from 'helpers/rendering/render';
import './subscriptionsLanding.scss';

import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import { subscriptionsLandingProps, type SubscriptionsLandingPropTypes } from './subscriptionsLandingProps';

// ----- Render ----- //

const SubscriptionsLandingPage = ({
  countryGroupId,
  participations,
  pricingCopy,
  referrerAcquisitions,
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
    <Page
      header={<Header />}
      footer={
        <Footer faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions" centred />
        }
    >
      <SubscriptionLandingContent
        countryGroupId={countryGroupId}
        participations={participations}
        pricingCopy={pricingCopy}
        referrerAcquisitions={referrerAcquisitions}
      />
    </Page>
  );
};

renderPage(<SubscriptionsLandingPage {...subscriptionsLandingProps()} />, 'subscriptions-landing-page');
