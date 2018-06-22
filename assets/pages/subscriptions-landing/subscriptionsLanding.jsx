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
import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import PatronsEventsContainer from 'components/patronsEvents/patronsEventsContainer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Setup ----- //

const supporterSectionId = 'supporter-options';


// ----- Redux Store ----- //

const store = pageInit();


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer disclaimer privacyPolicy />}
    >
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
        modifierClasses={['compact']}
      />
      <section id={supporterSectionId}>
        <ThreeSubscriptionsContainer />
      </section>
      <WhySupport />
      <ReadyToSupport ctaUrl={`#${supporterSectionId}`} />
      <PatronsEventsContainer />
    </Page>
  </Provider>
);

renderPage(content, 'subscriptions-landing-page');
