// @flow

// ----- Imports ----- //

import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';
import {
  getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  type CountryGroupId,
  detect as detectCountryGroup,
} from 'helpers/internationalisation/countryGroup';
import { analyticsInitialisation, consentInitialisation } from 'helpers/page/analyticsAndConsent';

// For pages that don't need Redux.
export function setUpTrackingAndConsents() {
  const country: IsoCountry = detectCountry();
  const countryGroupId: CountryGroupId = detectCountryGroup();
  const participations: Participations = abTest.init(country, countryGroupId, window.guardian.settings);
  const acquisitionData = getReferrerAcquisitionData();
  analyticsInitialisation(participations, acquisitionData);
  consentInitialisation(country);
}
