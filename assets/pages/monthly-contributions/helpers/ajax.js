// @flow

// ----- Imports ----- //

import { checkoutError } from '../actions/monthlyContributionsActions';


// ----- Setup ----- //

const MONTHLY_CONTRIB_ENDPOINT = '/monthly-contributions/create';
const MONTHLY_CONTRIB_THANKYOU = '/monthly-contributions/thankyou';


// ----- Types ----- //

type MonthlyContribFields = {
  contribution: {
    amount: number,
    currency: string,
  },
  paymentFields: {
    stripeToken: string,
  },
  country: string,
  firstName: string,
  lastName: string,
};

type PaymentField = 'baid' | 'stripeToken';


// ----- Functions ----- //

function requestData(paymentFieldName: PaymentField, token: string, getState: Function) {

  const state = getState();

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

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token },
    credentials: 'same-origin',
    body: JSON.stringify(monthlyContribFields),
  };

}

export default function postCheckout(paymentFieldName: PaymentField): Function {
  return (token: string, dispatch: Function, getState: Function) => {

    const request = requestData(paymentFieldName, token, getState);

    return fetch(MONTHLY_CONTRIB_ENDPOINT, request).then((response) => {

      const url: string = `${MONTHLY_CONTRIB_THANKYOU}?INTCMP=${getState().intCmp}`;

      if (response.ok) {
        window.location.assign(url);
      }

      response.text().then(err => dispatch(checkoutError(err)));

    });
  };
}
