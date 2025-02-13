// ----- Imports ----- //
import * as abTest from 'helpers/abTests/abtest';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	analyticsInitialisation,
	consentInitialisation,
	sendConsentToOphan,
} from 'helpers/page/analyticsAndConsent';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getSettings } from '../globalsAndSwitches/globals';

function setUpTrackingAndConsents(participations: Participations): void {
	const countryId: IsoCountry = Country.detect();
	const acquisitionData = getReferrerAcquisitionData();

	void consentInitialisation(countryId);
	analyticsInitialisation(participations, acquisitionData);
	sendConsentToOphan();
}

function getAbParticipations(): Participations {
	const settings = getSettings();
	const countryId: IsoCountry = Country.detect();
	const countryGroupId: CountryGroupId = CountryGroup.detect();
	const { amountsParticipation, selectedAmountsVariant } =
		getAmountsTestVariant(countryId, countryGroupId, settings);
	const abtestInitalizerData = {
		countryId,
		countryGroupId,
		selectedAmountsVariant,
		settings,
	};
	const participations: Participations = abTest.init(abtestInitalizerData);
	console.log({ participations });

	return {
		...participations,
		...amountsParticipation,
	};
}

// ----- Exports ----- //
export { getAbParticipations, setUpTrackingAndConsents };
