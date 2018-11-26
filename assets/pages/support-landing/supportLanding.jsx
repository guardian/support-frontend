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
import Contribute from 'components/contribute/contribute';
import { setInitialAmountsForAnnualVariants } from 'helpers/abTests/helpers/annualContributions';

// React components connected to redux store
import CountrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';
import PatronsEventsContainer from 'components/patronsEvents/patronsEventsContainer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { getOrigin } from 'helpers/url';

import pageReducer from './supportLandingReducer';

// Page-specific react components connected to redux store
import ContributionSelectionContainer from './components/contributionSelectionContainer';
import ContributionPaymentCtasContainer from './components/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from './components/payPalContributionButtonContainer';
import ContributionAwarePaymentLogosContainer from './components/contributionAwarePaymentLogosContainer';
import SubscriptionsSection from './components/subscriptionsSection';


// ----- Setup ----- //

const supporterSectionId = 'supporter-options';


// ----- Redux Store ----- //

const store = pageInit(pageReducer);


// ----- Internationalisation ----- //

const CountrySwitcherHeader = CountrySwitcherHeaderContainer(
  '/contribute',
  ['GBPCountries', 'UnitedStates', 'EURCountries', 'NZDCountries', 'Canada', 'International', 'AUDCountries'],
);


// ----- Render ----- //

const context = 'support-landing-page';

const content = (
  <Provider store={store}>
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer disclaimer privacyPolicy />}
    >
      <CirclesIntroduction
        headings={['Help us deliver the', 'independent journalism', 'the world needs']}
        highlights={['Support The Guardian']}
        modifierClasses={['compact']}
        highlightsHeadingSize={2}
      />
      <section id={supporterSectionId}>
        <Contribute
          heading="Contribute"
          copy="Your contribution funds and supports The Guardian's journalism."
          modifierClasses={['compact']}
        >
          <ContributionSelectionContainer />
          <ContributionAwarePaymentLogosContainer />
          <ContributionPaymentCtasContainer
            context={context}
            PayPalButton={() =>
              <PayPalContributionButtonContainer cancelURL={`${getOrigin()}/uk`} />
          }
          />
        </Contribute>
        <SubscriptionsSection
          context={context}
        />
      </section>
      <WhySupport headingSize={3} />
      <ReadyToSupport
        ctaUrl={`#${supporterSectionId}`}
        headingSize={2}
        context={context}
      />
      <PatronsEventsContainer
        context={context}
      />
    </Page>
  </Provider>
);

setInitialAmountsForAnnualVariants(store);
renderPage(content, 'support-landing-page');
