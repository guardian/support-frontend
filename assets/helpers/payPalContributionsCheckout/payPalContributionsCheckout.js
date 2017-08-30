// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import { toCountryGroup } from 'helpers/internationalisation/country';


// ----- Types ----- //

type PayPalPostData = {
  countryGroup: string,
  amount: number,
  intCmp: ?string,
  supportRedirect: boolean,
}


// ----- Functions ----- //

export function paypalContributionsRedirect(
  amount: number,
  intCmp: ?string,
  isoCountry: IsoCountry,
  errorHandler: (string) => void): void {

  const PAYPAL_CONTRIBUTION_ENDPOINT:string = window.guardian.contributionsPayPalEndpoint;

  const country = toCountryGroup(isoCountry);
  const postData: PayPalPostData = {
    countryGroup: country,
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
