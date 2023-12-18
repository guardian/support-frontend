// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import { Country } from 'helpers/internationalisation';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	analyticsInitialisation,
	consentInitialisation,
} from 'helpers/page/analyticsAndConsent';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

function setUpTrackingAndConsents(participations: Participations = {}): void {
	const countryId: IsoCountry = Country.detect();
	const acquisitionData = getReferrerAcquisitionData();
	void consentInitialisation(countryId);
	analyticsInitialisation(participations, acquisitionData);
}

// ----- Exports ----- //
export { setUpTrackingAndConsents };
