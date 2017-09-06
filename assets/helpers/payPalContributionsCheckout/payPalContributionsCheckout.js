// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import { toCountryGroup } from 'helpers/internationalisation/country';
import * as cookie from 'helpers/cookie';
import { addQueryParamToURL } from 'helpers/url';

// ----- Types ----- //

type PayPalPostData = {
  countryGroup: string,
  amount: number,
  intCmp: ?string,
  supportRedirect: boolean,
}


// ----- Functions ----- //

function payalContributionEndpoint(testUser) {
  if (testUser) {
    return addQueryParamToURL(
      window.guardian.contributionsPayPalEndpoint,
      '_test_username',
      testUser,
    );
  }

  return window.guardian.contributionsPayPalEndpoint;
}

export function paypalContributionsRedirect(
  amount: number,
  intCmp: ?string,
  refpvid: ?string,
  isoCountry: IsoCountry,
  errorHandler: (string) => void): void {

  const country = toCountryGroup(isoCountry);
  const postData: PayPalPostData = {
    countryGroup: country,
    amount,
    intCmp,
    refererPageviewId: refpvid,
    supportRedirect: true,
    /*
     TODO: pass these argument to contributions in order to improve
     the tracking of one-off contributions.

     cmp: state.data.cmpCode,
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

  fetch(payalContributionEndpoint(cookie.get('_test_username')), fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((res) => { window.location = res.approvalUrl; })
    .catch(() => errorHandler('Sorry, an error occurred, please try again or use another payment method.'));
}
