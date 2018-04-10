// @flow

// ----- Imports ----- //

import { participationsToAcquisitionABTest, getOphanIds } from 'helpers/tracking/acquisitions';
import * as cookie from 'helpers/cookie';
import { addQueryParamToURL, getAbsoluteURL } from 'helpers/url';
import { routes } from 'helpers/routes';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { OphanIds, AcquisitionABTest, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Types ----- //

type AcquisitionData = {|
  pageviewId: string,
  visitId: ?string,
  browserId: ?string,
  platform: ?string,
  referrerPageviewId: ?string,
  referrerUrl: ?string,
  campaignCodes: ?string[],
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  abTests: ?AcquisitionABTest[],
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
      'mode',
      'test',
    );
  }

  return window.guardian.contributionsPayPalEndpoint;
}

function storeAcquisitionData(
  referrerAcquisitionData: ReferrerAcquisitionData,
  nativeAbParticipations: Participations,
): void {
  const ophanIds: OphanIds = getOphanIds();

  const abTests: AcquisitionABTest[] = participationsToAcquisitionABTest(nativeAbParticipations);
  const campaignCodes = referrerAcquisitionData.campaignCode ?
    [referrerAcquisitionData.campaignCode] : [];

  if (referrerAcquisitionData.abTest) {
    abTests.push(referrerAcquisitionData.abTest);
  }

  const acquisitionData: AcquisitionData = {
    platform: 'SUPPORT',
    visitId: ophanIds.visitId,
    browserId: ophanIds.browserId,
    pageviewId: ophanIds.pageviewId,
    referrerPageviewId: referrerAcquisitionData.referrerPageviewId,
    referrerUrl: referrerAcquisitionData.referrerUrl,
    componentId: referrerAcquisitionData.componentId,
    campaignCodes,
    componentType: referrerAcquisitionData.componentType,
    source: referrerAcquisitionData.source,
    abTests,
  };

  cookie.set('acquisition_data', encodeURIComponent(JSON.stringify(acquisitionData)));
}

export function paypalContributionsRedirect(
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  errorHandler: (string) => void,
  nativeAbParticipations: Participations,
): void {

  storeAcquisitionData(referrerAcquisitionData, nativeAbParticipations);
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

  fetch(payalContributionEndpoint(cookie.get('_test_username')), fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((res) => { window.location = res.data.approvalUrl; })
    .catch(() => errorHandler('Sorry, an error occurred, please try again or use another payment method.'));
}
