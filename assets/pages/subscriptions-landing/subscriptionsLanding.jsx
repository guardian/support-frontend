// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

// React components
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import WhySupport from 'components/whySupport/whySupport';
import ReadyToSupport from 'components/readyToSupport/readyToSupport';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';

// React components connected to redux store
import PatronsEventsContainer from 'components/patronsEvents/patronsEventsContainer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import InternationalSubscriptions from 'components/internationalSubscriptions/internationalSubscriptionsContainer';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect } from 'helpers/internationalisation/countryGroup';
import SplitSubscriptionsTest from './components/splitSubscriptionsTest';


// ----- Setup ----- //

const supporterSectionId = 'supporter-options';
const countryGroupId: CountryGroupId = detect();


// ----- Redux Store ----- //

const store = pageInit();


// ----- Render ----- //

function getSubscriptionsForCountry() {
  if (countryGroupId === 'GBPCountries') {
    return <SplitSubscriptionsTest sectionId={supporterSectionId} />;
  }
  const testName = 'international_subs_landing_pages';
  return (
    <InternationalSubscriptions
      countryGroupId={countryGroupId}
      headingSize={3}
      clickEvents={{
        iOSApp: sendTrackingEventsOnClick('premium_tier_ios_cta', 'digital', testName, true),
        androidApp: sendTrackingEventsOnClick('premium_tier_android_cta', 'digital', testName, true),
        digiPack: sendTrackingEventsOnClick('digipack_cta', 'digital', testName, true),
        weekly: sendTrackingEventsOnClick('weekly_cta', 'print', testName, true),
      }}
    />);
}

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer disclaimer privacyPolicy />}
    >
      <CirclesIntroduction
        headings={['Help us deliver the', 'independent journalism', 'the world needs']}
        highlights={['Support The Guardian']}
        modifierClasses={['compact']}
        highlightsHeadingSize={2}
      />
      {getSubscriptionsForCountry()}
      <WhySupport headingSize={3} />
      <ReadyToSupport
        ctaUrl={`#${supporterSectionId}`}
        headingSize={2}
      />
      <PatronsEventsContainer />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
