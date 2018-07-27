// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import Loadable from 'react-loadable';
import { BrowserRouter } from 'react-router-dom';

import * as user from 'helpers/user/user';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';
import { getAmount, getPaymentMethod } from 'helpers/checkouts';
import { parseRegularContributionType } from 'helpers/contributions';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';

import reducer from './regularContributionsReducer';


import FormFields from './components/formFields';


// ----- Page Startup ----- //

const contributionType = parseRegularContributionType(getQueryParameter('contribType') || 'MONTHLY');

const store = pageInit(reducer(
  getAmount(contributionType, detectCountryGroup()),
  getPaymentMethod(),
  contributionType,
), true);

user.init(store.dispatch);

const Loading = () => <div>Loading...</div>;

const contributionsCheckoutContainer = Loadable({
  loader: () => import('./components/contributionsCheckoutContainer'),
  render(loaded) {
    const ContributionsCheckoutContainer = loaded.default;
    return <ContributionsCheckoutContainer contributionType={contributionType} form={<FormFields />} />;
  },
  loading: Loading,
});

const contributionsThankYouContainer = Loadable({
  loader: () => import('./components/contributionsThankYouPageContainer'),
  loading: Loading,
});

// ----- Render ----- //

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route exact path={routes.recurringContribCheckout} component={contributionsCheckoutContainer} />
        <Route exact path={routes.recurringContribThankyou} component={contributionsThankYouContainer} />
        <Route exact path={routes.recurringContribPending} component={contributionsThankYouContainer} />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'regular-contributions-page');
