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
import PromoDetails from 'pages/promotion-terms/promoDetails';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import type { State } from './promotionTermsReducer';

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);


// ----- Render ----- //

const PromotionTermsPage = (props: State) => (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <PromoDetails {...props.page.promotionTerms} />
      <LegalTerms {...props.page} />
    </Page>
  </Provider>
);

renderPage(PromotionTermsPage(store.getState()), 'promotion-terms');

