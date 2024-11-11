// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import { CountryHelper } from 'helpers/internationalisation/classes/country';
import { CountryGroupHelper } from 'helpers/internationalisation/classes/countryGroup';
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
	const countryId: IsoCountry = CountryHelper.detect();
	const countryGroupId: CountryGroupId = CountryGroupHelper.detect();
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
