// @flow

// ----- Imports ----- //

import { derivePaymentApiAcquisitionData } from 'helpers/tracking/acquisitions';
import * as cookie from 'helpers/cookie';
import { addQueryParamToURL, getAbsoluteURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Types ----- //

type PayPalPaymentAPIPostData = {|
  currency: IsoCurrency,
  amount: number,
  returnURL: string,
  cancelURL: string,
|}

// ----- Functions ----- //

function payPalContributionEndpoint(testUser) {
  if (testUser) {
    return addQueryParamToURL(
      window.guardian.paymentApiPayPalEndpoint,
      'mode',
      'test',
    );
  }

  return window.guardian.paymentApiPayPalEndpoint;
}

export function paypalContributionsRedirect(
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
  nativeAbParticipations: Participations,
): void {

  const acquisitionData = derivePaymentApiAcquisitionData(referrerAcquisitionData, nativeAbParticipations);
  cookie.set('acquisition_data', encodeURIComponent(JSON.stringify(acquisitionData)));

  const { currency } = countryGroups[countryGroupId];
  const postData: PayPalPaymentAPIPostData = {
    amount,
    currency,
    returnURL: getAbsoluteURL(routes.payPalRestReturnURL),
    cancelURL: getAbsoluteURL(routes.payPalRestCancelURL),
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

  fetch(payPalContributionEndpoint(cookie.get('_test_username')), fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((res) => { window.location = res.data.approvalUrl; })
    .catch(() => errorHandler('Sorry, an error occurred, please try again or use another payment method.'));
}
