import { getConsentFor, onConsentChange } from '@guardian/consent-manager';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { logException } from 'helpers/utilities/logger';
import type { MParticleSdk, Purchase } from './mparticleSdk';

type Config = NonNullable<AppConfig['mParticleConversions']>;
type PendingConversion = { config: Config; purchase: Purchase };

export function canUseMParticleConversions(
	enabled: boolean,
	config: AppConfig['mParticleConversions'],
): boolean {
	return enabled && Boolean(config?.apiKey.trim());
}

let observingConsent = false;
let hasConsent = false;
let hasGoogleConsent = false;
let stoppedUntilReload = false;
let pending: PendingConversion | undefined;
let processing = false;
let sdk: MParticleSdk | undefined;
let initialization: Promise<void> | undefined;
let initialized = false;
const attemptedOrders = new Set<string>();

function isCurrent(conversion: PendingConversion): boolean {
	return hasConsent && pending === conversion;
}

function denyGoogleConsent(): void {
	// The kit's opt-out does not unload Google's script. Withdraw ads permissions
	// immediately, including while SDK initialization is still in progress.
	const google = window as Window & {
		gtag?: (...args: unknown[]) => void;
	};
	google.gtag?.('consent', 'update', {
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
	});
}

function optOut(): void {
	if (initialization) {
		if (!hasGoogleConsent) {
			denyGoogleConsent();
		}
		sdk?.setOptOut(true);
	}
	if (initialized && sdk) {
		sdk.setConsent(false);
	}
}

async function dispatch(): Promise<void> {
	if (processing || !pending) {
		return;
	}
	const conversion = pending;
	if (!isCurrent(conversion)) {
		return;
	}
	processing = true;
	try {
		if (!sdk) {
			const { loadMParticleSdk } = await import('./mparticleSdk');
			if (!isCurrent(conversion)) {
				return;
			}
			sdk = await loadMParticleSdk();
		}
		if (!isCurrent(conversion)) {
			return;
		}
		initialization ??= sdk.initialize(conversion.config);
		await initialization;
		initialized = true;
		if (!hasConsent) {
			optOut();
			return;
		}
		if (pending !== conversion) {
			return;
		}
		sdk.setOptOut(false);
		sdk.setConsent(true);
		pending = undefined;
		if (attemptedOrders.has(conversion.purchase.orderId)) {
			return;
		}
		// Mark before dispatch: a thrown error cannot prove Google received nothing.
		attemptedOrders.add(conversion.purchase.orderId);
		sdk.logPurchase(conversion.purchase);
		sdk.upload();
	} catch {
		if (pending === conversion) {
			pending = undefined;
		}
		logException('mParticle conversion tracking failed');
	} finally {
		processing = false;
		if (pending && pending !== conversion) {
			void dispatch();
		}
	}
}

export function trackMParticleConversion(
	config: Config,
	purchase: Purchase,
): () => void {
	const conversion = { config, purchase };
	if (!stoppedUntilReload && !attemptedOrders.has(purchase.orderId)) {
		pending = conversion;
	}
	if (!observingConsent) {
		observingConsent = true;
		try {
			onConsentChange((state) => {
				const previouslyGranted = hasConsent;
				const previouslyGoogleGranted = hasGoogleConsent;
				hasGoogleConsent =
					state.canTarget && getConsentFor('remarketing', state);
				hasConsent =
					!stoppedUntilReload &&
					hasGoogleConsent &&
					getConsentFor('mparticle', state);
				if (!hasConsent && previouslyGranted) {
					// The kit caches Google consent separately. Do not resume with a
					// stale cache after withdrawal; a reload starts a fresh lifecycle.
					stoppedUntilReload = true;
					pending = undefined;
					optOut();
				}
				if (initialization && previouslyGoogleGranted && !hasGoogleConsent) {
					denyGoogleConsent();
				}
				if (hasConsent) {
					void dispatch();
				}
			});
		} catch {
			pending = undefined;
			hasConsent = false;
			logException('mParticle consent unavailable');
		}
	}
	void dispatch();
	return () => {
		if (pending === conversion) {
			pending = undefined;
		}
	};
}
