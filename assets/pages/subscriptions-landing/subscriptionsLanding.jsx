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
import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';

// React components connected to redux store

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import InternationalSubscriptions from 'components/internationalSubscriptions/internationalSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect } from 'helpers/internationalisation/countryGroup';


// ----- Setup ----- //

const supporterSectionId = 'supporter-options';
const countryGroupId: CountryGroupId = detect();


// ----- Redux Store ----- //

const store = pageInit();


// ----- Render ----- //

function getSubscriptionsForCountry() {
  if (countryGroupId === 'GBPCountries') {
    return (
      <section id={supporterSectionId}>
        <DigitalSubscriptionsContainer
          headingSize={3}
        />
        <PaperSubscriptionsContainer
          headingSize={3}
        />
      </section>
    );
  }

  return (
    <InternationalSubscriptions
      sectionId={supporterSectionId}
      countryGroupId={countryGroupId}
      headingSize={3}
    />);
}

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer disclaimer privacyPolicy countryGroupId={countryGroupId} />}
    >
      <CirclesIntroduction
        headings={['Help us deliver the', 'independent journalism', 'the world needs']}
        highlights={['Support The Guardian']}
        modifierClasses={['compact']}
        highlightsHeadingSize={2}
      />
      {getSubscriptionsForCountry()}
      <WhySupport headingSize={3} id="why-support" />
      <ReadyToSupport
        ctaUrl={`#${supporterSectionId}`}
        headingSize={2}
      />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
