// @flow

// ----- Imports ----- //

import { participationsToAcquisitionABTest, getOphanIds } from 'helpers/tracking/acquisitions';
import * as cookie from 'helpers/cookie';
import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { OphanIds, AcquisitionABTest, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Types ----- //

type PayPalPostData = {|
  countryGroup: string,
  amount: number,
  cmp: ?string,
  intCmp: ?string,
  refererPageviewId: ?string,
  refererUrl: ?string,
  ophanPageviewId: string,
  ophanBrowserId: ?string,
  ophanVisitId: ?string,
  supportRedirect: boolean,
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  refererAbTest: ?AcquisitionABTest,
  nativeAbTests: ?AcquisitionABTest[],
|}

type PayPalPaymentAPIPostData = {|
  currency: IsoCurrency,
  amount: number,
  returnURL: string,
  cancelURL: string,
|}

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
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
  nativeAbParticipations: Participations,
): void {

  const currency = countryGroups[countryGroupId].currency;
  // const ophanIds: OphanIds = getOphanIds();
  /*
    const postData: PayPalPostData = {
      countryGroup,
      amount,
      cmp: null,
      intCmp: referrerAcquisitionData.campaignCode,
      refererPageviewId: referrerAcquisitionData.referrerPageviewId,
      refererUrl: referrerAcquisitionData.referrerUrl,
      ophanPageviewId: ophanIds.pageviewId,
      ophanBrowserId: ophanIds.browserId,
      ophanVisitId: ophanIds.visitId,
      supportRedirect: true,
      componentId: referrerAcquisitionData.componentId,
      componentType: referrerAcquisitionData.componentType,
      source: referrerAcquisitionData.source,
      refererAbTest: referrerAcquisitionData.abTest,
      nativeAbTests: participationsToAcquisitionABTest(nativeAbParticipations),
    };
   */

  const postData: PayPalPaymentAPIPostData = {
    amount,
    currency,
    returnURL: routes.payPalRestReturnURL,
    cancelURL: routes.payPalRestCancelURL,
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
