// ----- Imports ----- //
import { getLocale } from '@guardian/libs';
import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import * as abTest from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	analyticsInitialisation,
	consentInitialisation,
	sendConsentToOphan,
} from 'helpers/page/analyticsAndConsent';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { DetectSupportRegion } from '../internationalisation/classes/detectSupportRegion';

async function setUpConsent(): Promise<void> {
	const countryId: CountryCode = Country.detect();
	// Initialize CMP first
	try {
		const localeCode = await getLocale();
		const country = localeCode ?? countryId;
		// Initialise the consent management platform using the getLocale result
		// If getLocale fails to determine a location, fall back to the country detected by the country module
		consentInitialisation(country);
	} catch (e) {
		console.log(`An exception was thrown getting the localeCode: ${String(e)}`);
		consentInitialisation(countryId);
	}

	return sendConsentToOphan();
}

function setUpTracking(participations: Participations): void {
	console.log({ participations });
	const acquisitionData = getReferrerAcquisitionData();
	analyticsInitialisation(participations, acquisitionData);
}

function setUpTrackingAndConsents(participations: Participations): void {
	void setUpConsent();
	setUpTracking(participations);
}

function getAbParticipations(): Participations {
	const countryId: CountryCode = Country.detect();
	const supportRegionId: SupportRegionId = DetectSupportRegion.detect();
	const abtestInitalizerData = {
		countryId,
		supportRegionId,
	};
	const participations: Participations = abTest.init(abtestInitalizerData);

	return {
		...participations,
	};
}

// ----- Exports ----- //
export {
	getAbParticipations,
	setUpConsent,
	setUpTracking,
	setUpTrackingAndConsents,
};
