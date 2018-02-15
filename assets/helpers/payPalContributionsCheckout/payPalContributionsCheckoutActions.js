// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //

export type Action =
  | { type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED' }
  | { type: 'PAYPAL_CONTRIBUTIONS_ERROR', message: string }
  | { type: 'PAYPAL_CONTRIBUTIONS_SUBMIT' };

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


export function paypalContributionsRedirect(
  amount: number,
  intCmp: ?string,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
): void {

  const PAYPAL_CONTRIBUTION_ENDPOINT:string = window.guardian.contributionsPayPalEndpoint;

  const countryGroup = countryGroups[countryGroupId].supportInternationalisationId;
  const postData: PayPalPostData = {
    countryGroup,
    amount,
    intCmp,
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
    .catch(() => errorHandler('Sorry, an error occurred, please try again or use another payment method.'));
}
