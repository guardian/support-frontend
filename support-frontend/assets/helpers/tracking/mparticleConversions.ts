import { getConsentFor, onConsentChange } from '@guardian/consent-manager';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { logException } from 'helpers/utilities/logger';
import type { MParticleSdk, Purchase } from './mparticleSdk';

type Config = NonNullable<AppConfig['mParticleConversions']>;
type ConversionSource = 'gtm' | 'mparticle';
type PendingConversion = {
	config: Config;
	createPurchase: () => Purchase;
	onRouteSelected: (source: ConversionSource) => void;
	route?: ConversionSource;
	purchase?: Purchase;
};

export function canUseMParticleConversions(
	enabled: boolean,
	config: AppConfig['mParticleConversions'],
): boolean {
	return enabled && Boolean(config?.apiKey.trim());
}

let observingConsent = false;
let hasConsent = false;
let hasGoogleConsent = false;
let hasGoogleTagManagerConsent = false;
let stoppedUntilReload = false;
let pending: PendingConversion | undefined;
let processing = false;
let sdk: MParticleSdk | undefined;
let initialization: Promise<void> | undefined;
let initialized = false;
const attemptedOrders = new Set<string>();

function isCurrent(conversion: PendingConversion): boolean {
	return (
		hasConsent && pending === conversion && conversion.route === 'mparticle'
	);
}

function updateGoogleConsent(granted: boolean): void {
	// The kit's opt-out does not unload Google's script, so update the shared signals.
	const google = window as Window & {
		gtag?: (...args: unknown[]) => void;
	};
	google.gtag?.('consent', 'update', {
		ad_storage: granted ? 'granted' : 'denied',
		ad_user_data: granted ? 'granted' : 'denied',
		ad_personalization: granted ? 'granted' : 'denied',
	});
}

function selectRoute(conversion: PendingConversion): void {
	if (pending !== conversion || conversion.route) {
		return;
	}
	if (hasConsent) {
		try {
			conversion.purchase = conversion.createPurchase();
			conversion.route = 'mparticle';
			conversion.onRouteSelected('mparticle');
			void dispatch();
		} catch {
			pending = undefined;
			logException('mParticle conversion tracking failed');
		}
	} else if (hasGoogleConsent && hasGoogleTagManagerConsent) {
		conversion.route = 'gtm';
		pending = undefined;
		conversion.onRouteSelected('gtm');
	}
}

function optOut(): void {
	if (initialization) {
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
	const purchase = conversion.purchase;
	if (!purchase) {
		pending = undefined;
		return;
	}
	if (attemptedOrders.has(purchase.orderId)) {
		pending = undefined;
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
		// Mark before dispatch: a thrown error cannot prove Google received nothing.
		attemptedOrders.add(purchase.orderId);
		sdk.logPurchase(purchase);
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
	createPurchase: () => Purchase,
	onRouteSelected: (source: ConversionSource) => void,
): () => void {
	const conversion: PendingConversion = {
		config,
		createPurchase,
		onRouteSelected,
	};
	if (!stoppedUntilReload) {
		pending = conversion;
	}
	if (!observingConsent) {
		observingConsent = true;
		try {
			onConsentChange((state) => {
				const previouslyGranted = hasConsent;
				const previouslyGoogleGranted = hasGoogleConsent;
				hasGoogleConsent = getConsentFor('remarketing', state);
				hasGoogleTagManagerConsent = getConsentFor('google-tag-manager', state);
				const hasMParticleConsent = getConsentFor('mparticle', state);
				hasConsent =
					!stoppedUntilReload && hasGoogleConsent && hasMParticleConsent;
				if (!hasConsent && previouslyGranted) {
					// The kit caches Google consent separately. Do not resume with a
					// stale cache after withdrawal; a reload starts a fresh lifecycle.
					stoppedUntilReload = true;
					pending = undefined;
					optOut();
				}
				if (initialization && previouslyGoogleGranted !== hasGoogleConsent) {
					updateGoogleConsent(hasGoogleConsent);
				}
				if (pending) {
					selectRoute(pending);
				}
			});
		} catch {
			if (pending === conversion) {
				pending = undefined;
			}
			hasConsent = false;
			logException('mParticle consent unavailable');
			if (!conversion.route) {
				conversion.route = 'gtm';
				conversion.onRouteSelected('gtm');
			}
		}
	}
	if (pending === conversion) {
		selectRoute(conversion);
	}
	void dispatch();
	return () => {
		if (pending === conversion) {
			pending = undefined;
		}
	};
}
