// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import { Country, CountryGroup } from 'helpers/internationalisation';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	analyticsInitialisation,
	consentInitialisation,
} from 'helpers/page/analyticsAndConsent';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getSettings } from '../globalsAndSwitches/globals';

function setUpTrackingAndConsents(): void {
	const settings = getSettings();
	const countryId: IsoCountry = Country.detect();
	const countryGroupId: CountryGroupId = CountryGroup.detect();
	const abtestInitalizerData = {
		countryId,
		countryGroupId,
	};
	const participations: Participations = abTest.init(abtestInitalizerData);
	const { amountsParticipation } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		settings,
	);
	const participationsWithAmountsTest = {
		...participations,
		...amountsParticipation,
	};
	const acquisitionData = getReferrerAcquisitionData();
	void consentInitialisation(countryId);
	analyticsInitialisation(participationsWithAmountsTest, acquisitionData);
}

// ----- Exports ----- //
export { setUpTrackingAndConsents };
