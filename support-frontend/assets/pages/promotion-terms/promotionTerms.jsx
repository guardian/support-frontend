// @flow

import { renderPage } from 'helpers/render';
import React from 'react';
import './promotionTerms.scss';
import { init as pageInit } from 'helpers/page/page';
import reducer from './promotionTermsReducer';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import Header from 'components/headers/header/header';
import { Provider } from 'react-redux';
import PromoDetails from 'pages/promotion-terms/PromoDetails';

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <PromoDetails />
    </Page>
  </Provider>
);

renderPage(content, 'promotion-terms');

