// ----- Imports ----- //
import * as ophan from 'ophan';
import type { Participations } from 'helpers/abTests/abtest';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import {
	setReferrerDataInLocalStorage,
	trackAbTests,
} from 'helpers/tracking/ophan';
import { isPostDeployUser } from 'helpers/user/user';
import * as logger from 'helpers/utilities/logger';
import 'helpers/internationalisation/country';
// ----- Functions ----- //
// Sets up GA and logging.
export function analyticsInitialisation(
	participations: Participations,
	acquisitionData: ReferrerAcquisitionData,
): void {
	setReferrerDataInLocalStorage(acquisitionData);
	googleTagManager.init(participations);
	ophan.init();
	trackAbTests(participations);
	// Logging.
	logger.init();
}
export async function consentInitialisation(country: IsoCountry) {
	/**
	 * Dynamically load @guardian/consent-management-platform
	 * on condition we're not server side rendering (ssr) the page.
	 * @guardian/consent-management-platform breaks ssr otherwise.
	 */
	if (!getGlobal('ssr') && !isPostDeployUser()) {
		const { cmp } = await import('@guardian/consent-management-platform');
		cmp.init({
			country,
		});
	}
}
