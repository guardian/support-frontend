// @flow

import type { CombinedState } from './payPalContributionsCheckoutReducer';

// ----- Types ----- //

export type Action =
  | { type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED' }
  | { type: 'PAYPAL_CONTRIBUTIONS_ERROR', message: string }
  | { type: 'PAYPAL_CONTRIBUTIONS_SUBMIT' }
  ;

type PayPalPostData = {
  countryGroup: string,
  amount: number,
  intCmp: ?string,
  supportRedirect: boolean,
}

// ----- Actions ----- //

export function payPalContributionsButtonClicked(): Action {
  return { type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED' };
}

export function payPalContributionsSubmitPayment(): Action {
  return { type: 'PAYPAL_CONTRIBUTIONS_SUBMIT' };
}


export function payPalContributionsError(message: string): Action {
  return { type: 'PAYPAL_CONTRIBUTIONS_ERROR', message };
}


export function paypalContributionsRedirect(): Function {

  const PAYPAL_CONTRIBUTION_ENDPOINT:string = window.guardian.contributionsPayPalEndpoint;

  return (dispatch, getState: () => CombinedState) => {

    const state = getState();

    dispatch(payPalContributionsSubmitPayment());


    const postData: PayPalPostData = {
      countryGroup: 'uk',
      amount: state.payPalContributionsCheckout.amount,
      intCmp: state.intCmp,
      supportRedirect: true,
      /*
       TODO: pass these argument to contributions in order to improve
       the tracking of one-off contributions.

       cmp: state.data.cmpCode,
       refererPageviewId: state.data.refererPageviewId,
       refererUrl: state.data.refererUrl,
       ophanPageviewId: state.data.ophan.pageviewId,
       ophanBrowserId: state.data.ophan.browserId,
       ophanVisitId: state.data.ophan.visitId
      */
    };

    const fetchOptions: Object = {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    };

    fetch(PAYPAL_CONTRIBUTION_ENDPOINT, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => { window.location = res.approvalUrl; })
      .catch(() => dispatch(payPalContributionsError('Sorry, an error occurred, please try again or use another payment method.')));
  };
}
