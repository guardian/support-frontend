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
import { getAmount, getPaymentMethodFromSession } from 'helpers/checkouts';
import { parseRegularContributionType } from 'helpers/contributions';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import ContributionsCheckoutContainer from './components/contributionsCheckoutContainer';
import ContributionsGuestCheckoutContainer from './components/contributionsGuestCheckoutContainer';
import reducer from './regularContributionsReducer';
import FormFields, { formClassName } from './components/formFields';
import RegularContributionsPayment from './components/regularContributionsPayment';
import { checkIfEmailHasPassword } from './regularContributionsActions';
import { setCheckoutFormHasBeenSubmitted } from './helpers/checkoutForm/checkoutFormActions';
// ----- Page Startup ----- //

const contributionType = parseRegularContributionType(getQueryParameter('contribType') || 'MONTHLY');
const countryGroup = detectCountryGroup();

const store = pageInit(reducer(
  getAmount(contributionType, countryGroup),
  getPaymentMethodFromSession(),
  contributionType,
  countryGroup,
), true);

user.init(store.dispatch);

const state = store.getState();
store.dispatch(checkIfEmailHasPassword(state.page.user.email));

const Loading = () => <div>Loading...</div>;

const ContributionsThankYouContainer = Loadable({
  loader: () => import('./components/contributionsThankYouPageContainer'),
  loading: Loading,
});


// ----- Render ----- //

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path={routes.recurringContribCheckout}
          render={() => (
            <ContributionsCheckoutContainer
              contributionType={contributionType}
              form={<FormFields />}
              payment={
                <RegularContributionsPayment
                  whenUnableToOpen={
                    () =>
                      store.dispatch(setCheckoutFormHasBeenSubmitted())
                  }
                  canOpen={
                    () => formIsValid(formClassName)
                  }
                />
              }
            />
          )}
        />
        <Route
          exact
          path={routes.recurringContribCheckoutGuest}
          render={() => (
            <ContributionsGuestCheckoutContainer
              contributionType={contributionType}
              form={<FormFields />}
              payment={
                <RegularContributionsPayment />
              }
            />
          )}
        />
        <Route
          exact
          path={routes.recurringContribThankyou}
          component={() => (
            <ContributionsThankYouContainer />
          )}
        />
        <Route
          exact
          path={routes.recurringContribPending}
          component={() => (
            <ContributionsThankYouContainer />
          )}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, 'regular-contributions-page');
