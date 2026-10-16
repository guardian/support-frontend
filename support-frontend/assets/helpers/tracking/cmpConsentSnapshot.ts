import { cmp, onConsent } from '@guardian/consent-manager';
import type { ConsentState } from '@guardian/consent-manager';
import type { CmpConsentSnapshot } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

const CONSENT_READ_TIMEOUT_MILLISECONDS = 1000;

const isConsentMap = (value: unknown): value is Record<string, boolean> =>
	typeof value === 'object' &&
	value !== null &&
	!Array.isArray(value) &&
	Object.values(value).every((consent) => typeof consent === 'boolean');

const isNonEmptyConsentMap = (
	value: unknown,
): value is Record<string, boolean> =>
	isConsentMap(value) && Object.keys(value).length > 0;

const toSnapshot = (
	state: ConsentState,
	capturedAt: string,
): CmpConsentSnapshot | null => {
	const metadata = {
		capturedAt,
		consentManagerVersion: cmp.version,
		...(state.gpcSignal === undefined ? {} : { gpcSignal: state.gpcSignal }),
	};

	switch (state.framework) {
		case 'tcfv2': {
			const tcfv2 = state.tcfv2;
			if (
				!tcfv2 ||
				!isNonEmptyConsentMap(tcfv2.consents) ||
				!isConsentMap(tcfv2.vendorConsents) ||
				typeof tcfv2.eventStatus !== 'string' ||
				typeof tcfv2.addtlConsent !== 'string' ||
				typeof tcfv2.tcString !== 'string'
			) {
				return null;
			}

			return {
				...metadata,
				framework: 'tcfv2',
				tcfv2: {
					gdprApplies: tcfv2.gdprApplies ?? null,
					consents: { ...tcfv2.consents },
					vendorConsents: { ...tcfv2.vendorConsents },
					eventStatus: tcfv2.eventStatus,
					addtlConsent: tcfv2.addtlConsent,
					tcString: tcfv2.tcString,
				},
			};
		}
		case 'usnat': {
			const usnat = state.usnat;
			if (
				!usnat ||
				typeof usnat.doNotSell !== 'boolean' ||
				typeof usnat.signalStatus !== 'string'
			) {
				return null;
			}

			return {
				...metadata,
				framework: 'usnat',
				usnat: {
					doNotSell: usnat.doNotSell,
					signalStatus: usnat.signalStatus,
				},
			};
		}
		case 'aus': {
			const aus = state.aus;
			if (
				!aus ||
				typeof aus.personalisedAdvertising !== 'boolean' ||
				typeof aus.signalStatus !== 'string'
			) {
				return null;
			}

			return {
				...metadata,
				framework: 'aus',
				aus: {
					personalisedAdvertising: aus.personalisedAdvertising,
					signalStatus: aus.signalStatus,
				},
			};
		}
		default:
			return null;
	}
};

export const readCmpConsentSnapshot =
	async (): Promise<CmpConsentSnapshot | null> => {
		const capturedAt = new Date().toISOString();
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		try {
			const consentState = await Promise.race([
				onConsent(),
				new Promise<null>((resolve) => {
					timeoutId = setTimeout(
						() => resolve(null),
						CONSENT_READ_TIMEOUT_MILLISECONDS,
					);
				}),
			]);

			return consentState ? toSnapshot(consentState, capturedAt) : null;
		} catch {
			return null;
		} finally {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		}
	};
