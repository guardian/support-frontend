// ----- Imports ----- //
import { getLocale } from '@guardian/libs';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import * as abTest from 'helpers/abTests/abtest';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import {
	analyticsInitialisation,
	consentInitialisation,
	sendConsentToOphan,
} from 'helpers/page/analyticsAndConsent';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getSettings } from '../globalsAndSwitches/globals';

function setUpTrackingAndConsents(participations: Participations): void {
	console.log({ participations });
	const countryId: IsoCountry = Country.detect();
	const acquisitionData = getReferrerAcquisitionData();

	getLocale()
		.then((localeCode) => {
			const country = localeCode ?? countryId;
			// Initialise the consent management platform using the getLocale result
			// If getLocale fails to determine a location, fall back to the country detected by the country module
			consentInitialisation(country);
		})
		.catch((e) => {
			console.log(`An exception was thrown getting the localeCode: ${e}`);
			consentInitialisation(countryId);
		});

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
	};
	const participations: Participations = abTest.init(abtestInitalizerData);

	return {
		...participations,
		...amountsParticipation,
	};
}

// ----- Exports ----- //
export { getAbParticipations, setUpTrackingAndConsents };
