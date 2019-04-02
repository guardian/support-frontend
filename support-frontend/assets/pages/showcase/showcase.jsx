// @flow

// ----- Imports ----- //
import React from 'react';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import Heading from 'components/heading/heading';

import Content from 'components/content/content';

import 'stylesheets/skeleton/skeleton.scss';

import WhySupportMatters from './components/whySupportMatters';
import BreakingHeadlines from './components/breakingHeadlines';
import NoOneEdits from './components/noOneEdits';
import Hero from './components/hero';
import CtaSubscribe from './components/ctaSubscribe';
import CtaContribute from './components/ctaContribute';
import OtherProducts from './components/otherProducts';
import ConsentBanner from 'components/consentBanner/consentBanner';
import ReactDOMServer from 'react-dom/server';

import './showcase.scss';
import { Provider } from 'react-redux';

// ----- Page Startup ----- //

const store = pageInit();

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page header={<Header />} footer={<Footer />}>
      <Hero />
      <WhySupportMatters />
      <BreakingHeadlines />
      <NoOneEdits />
      <Content id="support">
        <Heading size={2} className="anchor">
          Ways you can support The Guardian
        </Heading>
      </Content>
      <CtaSubscribe />
      <CtaContribute />
      <OtherProducts />
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, 'showcase-landing-page');

export function getHtml() {
  return ReactDOMServer.renderToString(content);
}
