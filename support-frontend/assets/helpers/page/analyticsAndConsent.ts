// ----- Imports ----- //
import ophan from 'ophan';
import type { Participations } from 'helpers/abTests/abtest';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import {
	setReferrerDataInLocalStorage,
	trackAbTests,
} from 'helpers/tracking/ophan';
import { init as initQuantumMetric } from 'helpers/tracking/quantumMetric';
import { isPostDeployUser } from 'helpers/user/user';
import { init as initLogger } from 'helpers/utilities/logger';
import 'helpers/internationalisation/country';

// ----- Functions ----- //

// Sets up GA and logging.
const analyticsInitialisation = (
	participations: Participations,
	acquisitionData: ReferrerAcquisitionData,
): void => {
	setReferrerDataInLocalStorage(acquisitionData);
	googleTagManager.init(participations);
	ophan.init();
	initQuantumMetric();
	trackAbTests(participations);
	// Sentry logging.
	initLogger().catch((err) => {
		throw err;
	});
};

const consentInitialisation = async (country: IsoCountry): Promise<void> => {
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
};

export { analyticsInitialisation, consentInitialisation };
