// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import type { IsoCountry, UsState } from 'helpers/internationalisation/country';
import type { CombinedState } from '../reducers/reducers';

import { checkoutError } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

type MonthlyContribFields = {
  contribution: {
    amount: number,
    currency: string,
  },
  paymentFields: {
    stripeToken: string,
  },
  country: IsoCountry,
  state?: UsState,
  firstName: string,
  lastName: string,
};

type PaymentField = 'baid' | 'stripeToken';


// ----- Functions ----- //

function requestData(paymentFieldName: PaymentField, token: string, getState: () => CombinedState) {

  const state = getState();

  if (state.user.firstName !== null && state.user.firstName !== undefined
    && state.user.lastName !== null && state.user.lastName !== undefined
    && state.user.email !== null && state.user.email !== undefined) {
    const monthlyContribFields: MonthlyContribFields = {
      contribution: {
        amount: state.stripeCheckout.amount,
        currency: state.stripeCheckout.currency,
      },
      paymentFields: {
        [paymentFieldName]: token,
      },
      country: state.monthlyContrib.country,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
    };

    if (state.user.stateField) {
      monthlyContribFields.state = state.user.stateField;
    }

    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token || '' },
      credentials: 'same-origin',
      body: JSON.stringify(monthlyContribFields),
    };
  }

  return Promise.resolve({
    ok: false,
    text: () => 'Failed to process payment - missing fields',
  });
}

export default function postCheckout(paymentFieldName: PaymentField): Function {
  return (token: string, dispatch: Function, getState: () => CombinedState) => {

    const request = requestData(paymentFieldName, token, getState);

    return fetch(routes.recurringContribCreate, request).then((response) => {

      const url: string = addQueryParamToURL(
        routes.recurringContribThankyou,
        'INTCMP',
        getState().intCmp,
      );

      if (response.ok) {
        window.location.assign(url);
        return;
      }

      response.text().then(err => dispatch(checkoutError(err)));

    });
  };
}
