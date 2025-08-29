// ----- Imports ----- //

import type { ConsentState } from '@guardian/libs';
import { cmp, getCookie, onConsent } from '@guardian/libs';
import { init, record, viewId } from '@guardian/ophan-tracker-js/support';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { Participations } from 'helpers/abTests/models';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import * as googleTagManager from 'helpers/tracking/googleTagManager';
import { init as initQuantumMetric } from 'helpers/tracking/quantumMetric';
import { isPostDeployUser } from 'helpers/user/user';
import { init as initLogger } from 'helpers/utilities/logger';
import {
	setReferrerDataInLocalStorage,
	trackAbTests,
} from '../tracking/trackingOphan';

// ----- Functions ----- //

// Sets up GA and logging.
function analyticsInitialisation(
	participations: Participations,
	acquisitionData: ReferrerAcquisitionData,
): void {
	setReferrerDataInLocalStorage(acquisitionData);
	void googleTagManager.init();
	init();
	initQuantumMetric(participations, acquisitionData);
	trackAbTests(participations);
	// Sentry logging.
	initLogger().catch((err) => {
		throw err;
	});
}

function consentInitialisation(country: IsoCountry): void {
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

function sendConsentToOphan(): void {
	onConsent()
		.then((consentState) => {
			return record(getOphanConsentDetails(consentState));
		})
		.catch((error) => {
			console.error(error);
		});

	const getOphanConsentDetails = (
		consentState: ConsentState,
	): {
		consentJurisdiction: 'TCF' | 'USNAT' | 'AUS' | 'OTHER';
		consentUUID: string;
		consent: string;
	} => {
		if (consentState.tcfv2) {
			return {
				consentJurisdiction: 'TCF',
				consentUUID: getCookie({ name: 'consentUUID' }) ?? '',
				consent: consentState.tcfv2.tcString,
			};
		}
		if (consentState.usnat) {
			// Users who interacted with the CCPA banner before the migration to usnat will still have a ccpaUUID cookie. The usnatUUID cookie is set when the USNAT banner is interacted with. We need to check both cookies to ensure we have the correct consentUUID.
			const consentUUID =
				getCookie({ name: 'usnatUUID' }) ?? getCookie({ name: 'ccpaUUID' });
			return {
				consentJurisdiction: 'USNAT',
				consentUUID: consentUUID ?? '',
				consent: consentState.usnat.doNotSell ? 'false' : 'true',
			};
		}
		if (consentState.aus) {
			return {
				consentJurisdiction: 'AUS',
				consentUUID: getCookie({ name: 'ccpaUUID' }) ?? '',
				consent: consentState.aus.personalisedAdvertising ? 'true' : 'false',
			};
		}
		return {
			consentJurisdiction: 'OTHER',
			consentUUID: '',
			consent: '',
		};
	};
}

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

export { analyticsInitialisation, consentInitialisation, sendConsentToOphan };
