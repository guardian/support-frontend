// ----- Imports ----- //

import {
	cmp,
	getConsentDetailsForOphan,
	onConsent,
} from '@guardian/consent-manager';
import type { CountryCode } from '@guardian/libs';
import  { getCookie } from '@guardian/libs';
import { init, record, viewId } from '@guardian/ophan-tracker-js/support';
import type { Participations } from 'helpers/abTests/models';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import { init as initQuantumMetric } from 'helpers/tracking/quantumMetric';
import { isPostDeployUser } from 'helpers/user/user';
import { init as initLogger } from 'helpers/utilities/logger';
import {
	setReferrerDataInLocalStorage,
	trackAbTests,
	trackBFCacheLoad,
} from '../tracking/trackingOphan';

// ----- Functions ----- //

let hasRegisteredBFCacheTracking = false;

const registerBFCacheTracking = (): void => {
	if (hasRegisteredBFCacheTracking || typeof window === 'undefined') {
		return;
	}

	const handlePageShow = (event: PageTransitionEvent): void => {
		if (event.persisted) {
			trackBFCacheLoad();
		}
	};

	window.addEventListener('pageshow', handlePageShow);
	hasRegisteredBFCacheTracking = true;
};

// Sets up GA and logging.
function analyticsInitialisation(
	participations: Participations,
	acquisitionData: ReferrerAcquisitionData,
): void {
	setReferrerDataInLocalStorage(acquisitionData);
	void googleTagManager.init();
	init();
	registerBFCacheTracking();
	initQuantumMetric(participations, acquisitionData);
	trackAbTests(participations);
	// Sentry logging.
	initLogger().catch((err) => {
		throw err;
	});
}

function consentInitialisation(country: CountryCode): void {
	if (shouldInitCmp()) {
		try {
			const browserId = getCookie({ name: 'bwid', shouldMemoize: true });
			cmp.init({
				pubData: {
					pageViewId: viewId,
					browserId: browserId ?? undefined,
					platform: 'support',
				},
				country,
				useNonAdvertisedList: true,
			});
		} catch (e) {
			if (typeof e === 'string') {
				console.log(`An exception was thrown initialising the CMP: ${e}`);
			} else if (e instanceof Error) {
				console.log(
					`An exception was thrown initialising the CMP: ${e.message}`,
				);
			}
		}
	}
}

async function sendConsentToOphan(): Promise<void> {
	try {
		const consentState = await onConsent();
		record(getConsentDetailsForOphan(consentState));
	} catch (error) {
		console.error(error);
	}
}

const hasTargetingConsent = async (): Promise<boolean> => {
	try {
		// If the consent banner is displayed then do not wait - just return false
		if (await cmp.willShowPrivacyMessage()) {
			return false;
		}
		const { canTarget } = await onConsent();
		return canTarget;
	} catch (error) {
		console.error('Error getting targeting consent', error);
		return false;
	}
};

// ----- Helpers ----- //

function shouldInitCmp(): boolean {
	/**
	 * We only init the CMP on condition we're not:
	 *   - server side rendering (ssr) the page (@guardian/consent-management-platform breaks ssr)
	 *   - a post deploy user
	 */
	return !isPostDeployUser();
}

// ----- Exports ----- //

export {
	analyticsInitialisation,
	consentInitialisation,
	sendConsentToOphan,
	hasTargetingConsent,
};
