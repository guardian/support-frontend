// @flow

import React from 'react';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import Provider from "react-redux/es/components/Provider";

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import pageReducer from "./supportLanding2Reducer";

import PlainIntroduction from 'components/introduction/PlainIntroduction';
import WhySupportMatters from 'components/whySupportMatters/WhySupportMatters';
import BeyondHeadlines from 'components/beyondHeadlines/BeyondHeadlines';
import WaysToSupport from 'components/waysToSupport/WaysToSupport';
import PatronsEventsContainer from 'components/patronsEvents/patronsEventsContainer';

const store = pageInit(pageReducer);

const content = (
  <Provider store={store}>
    <Page header={<SimpleHeader />} footer={<Footer disclaimer privacyPolicy/>}>
      <PlainIntroduction />
      <WhySupportMatters ctaUrl={"#ways-to-support"}/>
      <BeyondHeadlines />
      <WaysToSupport id={"ways-to-support"}/>
      <PatronsEventsContainer />
    </Page>
  </Provider>
);

renderPage(content, 'support-landing-page-2');
