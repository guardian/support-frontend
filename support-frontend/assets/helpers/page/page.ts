// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import {
	analyticsInitialisation,
	consentInitialisation,
} from 'helpers/page/analyticsAndConsent';
import type { CommonState } from 'helpers/redux/commonState/state';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

// ----- Types ----- //
export type ReduxState<PageState> = {
	common: CommonState;
	page: PageState;
};

function setUpTrackingAndConsents(): void {
	const countryId: IsoCountry = detectCountry();
	const countryGroupId: CountryGroupId = detectCountryGroup();
	const settings = getSettings();
	const participations: Participations = abTest.init(
		countryId,
		countryGroupId,
		settings,
	);
	const acquisitionData = getReferrerAcquisitionData();
	void consentInitialisation(countryId);
	analyticsInitialisation(participations, acquisitionData);
}

// ----- Exports ----- //
export { setUpTrackingAndConsents };
