// @flow

import { renderPage } from 'helpers/rendering/render';
import React from 'react';
import './promotionTerms.scss';
import { init as pageInit } from 'helpers/page/page';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import { DigitalPack, GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { State } from './promotionTermsReducer';
import reducer from './promotionTermsReducer';
import Page from 'components/page/page';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { Provider } from 'react-redux';
import PromoDetails from 'pages/promotion-terms/promoDetails';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import { detect } from 'helpers/internationalisation/countryGroup';

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);

function getTermsConditionsLink({ product }: PromotionTerms) {
  if (product === DigitalPack) {
    return 'https://www.theguardian.com/digital-subscriptions-terms-conditions';
  } else if (product === GuardianWeekly) {
    return 'https://www.theguardian.com/guardian-weekly-subscription-terms-conditions';
  }
  return '';
}

// ----- Render ----- //

const PromotionTermsPage = (props: State) => (
  <Provider store={store}>
    <Page
      header={<Header countryGroupId={detect()} />}
      footer={<Footer
        faqsLink="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
        termsConditionsLink={getTermsConditionsLink(props.page.promotionTerms)}
      />}
    >
      <PromoDetails {...props.page.promotionTerms} />
      <LegalTerms {...props.page} />
    </Page>
  </Provider>
);

renderPage(PromotionTermsPage(store.getState()), 'promotion-terms');
