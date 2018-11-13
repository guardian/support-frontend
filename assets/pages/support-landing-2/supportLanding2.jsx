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
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';

import './supportLanding2.scss';

const store = pageInit(pageReducer);


const content = (
  <Provider store={store}>
    <Page header={<SimpleHeader/>} footer={<Footer disclaimer privacyPolicy/>}>
      <PlainIntroduction />
      <ProductPageContentBlock>
        <WhySupportMatters ctaUrl={'#ways-to-support'}/>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <BeyondHeadlines />
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <WaysToSupport id={'ways-to-support'}/>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <PatronsEventsContainer />
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, 'support-landing-page-2');
