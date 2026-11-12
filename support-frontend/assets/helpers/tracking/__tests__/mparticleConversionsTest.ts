import type { ConsentState } from '@guardian/consent-manager';
import type * as ConsentManager from '@guardian/consent-manager';
import type * as Logger from 'helpers/utilities/logger';
import type * as Conversions from '../mparticleConversions';

jest.mock('@guardian/consent-manager', () => ({
	onConsentChange: jest.fn(),
	getConsentFor: jest.fn(),
}));
jest.mock('../mparticleSdk', () => ({ loadMParticleSdk: jest.fn() }));
jest.mock('helpers/utilities/logger', () => ({ logException: jest.fn() }));

const purchase = {
	orderId: 'purchase-session-123',
	value: 6,
	currency: 'GBP',
	productType: 'SupporterPlus',
	ratePlan: 'Monthly',
	billingPeriod: 'Monthly',
	contributionType: 'MONTHLY',
	paymentMethod: 'Stripe',
};
const config = { apiKey: 'public-web-input', isDevelopmentMode: true };
const settle = async () => {
	for (let i = 0; i < 10; i++) {
		await Promise.resolve();
	}
};

function setup() {
	jest.resetModules();
	const cmp = jest.requireMock<jest.Mocked<typeof ConsentManager>>(
		'@guardian/consent-manager',
	);
	const loader = jest.requireMock<{
		loadMParticleSdk: jest.Mock;
	}>('../mparticleSdk');
	const sdk = {
		initialize: jest.fn().mockResolvedValue(undefined),
		setConsent: jest.fn(),
		setOptOut: jest.fn(),
		logPurchase: jest.fn(),
		upload: jest.fn(),
	};
	loader.loadMParticleSdk.mockResolvedValue(sdk);
	const tracker = jest.requireActual<typeof Conversions>(
		'../mparticleConversions',
	);
	const consent = (
		allowed: boolean,
		mparticle = allowed,
		remarketing = allowed,
		googleTagManager = allowed,
	) => {
		cmp.getConsentFor.mockImplementation((vendor: string) => {
			if (vendor === 'mparticle') {
				return mparticle;
			}
			if (vendor === 'google-tag-manager') {
				return googleTagManager;
			}
			return remarketing;
		});
		const callback = cmp.onConsentChange.mock.calls[0]?.[0];
		callback?.({ canTarget: allowed } as ConsentState);
	};
	return { tracker, loader, sdk, consent };
}

describe('mParticle conversions', () => {
	it('requires both the switch and a public key to select mParticle', () => {
		const { tracker } = setup();
		expect(tracker.canUseMParticleConversions(true, config)).toBe(true);
		for (const [enabled, configured] of [
			[false, config],
			[true, undefined],
			[true, { ...config, apiKey: ' ' }],
		] as const) {
			expect(tracker.canUseMParticleConversions(enabled, configured)).toBe(
				false,
			);
		}
	});

	it.each([
		['vendor grants without global targeting', false, true, true, true],
		['mParticle', true, false, true, false],
		['Google remarketing', true, true, false, true],
	] as const)(
		'handles %s consent and sends the exact conversion once',
		async (
			_permission,
			canTarget,
			mparticle,
			remarketing,
			googleTagManager,
		) => {
			const { tracker, loader, sdk, consent } = setup();
			const createPurchase = jest.fn(() => purchase);
			const onRouteSelected = jest.fn();
			tracker.trackMParticleConversion(config, createPurchase, onRouteSelected);
			expect(createPurchase).not.toHaveBeenCalled();
			expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
			consent(canTarget, mparticle, remarketing, googleTagManager);
			await settle();
			if (!canTarget) {
				expect(onRouteSelected).toHaveBeenCalledWith('mparticle');
				expect(createPurchase).toHaveBeenCalledTimes(1);
				expect(sdk.initialize).toHaveBeenCalledWith(config);
				expect(sdk.setConsent).toHaveBeenCalledWith(true);
				expect(sdk.logPurchase).toHaveBeenCalledWith(purchase);
				expect(sdk.upload).toHaveBeenCalledTimes(1);
				return;
			}
			expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
			expect(sdk.initialize).not.toHaveBeenCalled();
			expect(sdk.logPurchase).not.toHaveBeenCalled();
			expect(createPurchase).not.toHaveBeenCalled();
			expect(onRouteSelected).not.toHaveBeenCalled();
			consent(true);
			await settle();
			expect(onRouteSelected).toHaveBeenCalledWith('mparticle');
			expect(createPurchase).toHaveBeenCalledTimes(1);
			expect(sdk.initialize).toHaveBeenCalledWith(config);
			expect(sdk.setConsent).toHaveBeenCalledWith(true);
			expect(sdk.logPurchase).toHaveBeenCalledWith(purchase);
			expect(sdk.upload).toHaveBeenCalledTimes(1);
			consent(true);
			tracker.trackMParticleConversion(config, () => purchase, jest.fn());
			await settle();
			expect(sdk.logPurchase).toHaveBeenCalledTimes(1);
		},
	);

	it('uses GTM when mParticle is denied but Google and GTM consent are granted', () => {
		const { tracker, loader, consent } = setup();
		const createPurchase = jest.fn(() => purchase);
		const onRouteSelected = jest.fn();
		tracker.trackMParticleConversion(config, createPurchase, onRouteSelected);
		consent(true, false, true, true);
		expect(onRouteSelected).toHaveBeenCalledWith('gtm');
		expect(createPurchase).not.toHaveBeenCalled();
		expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
	});

	it('cancels a purchase when the route leaves before consent', async () => {
		const { tracker, loader, consent } = setup();
		const createPurchase = jest.fn(() => purchase);
		const onRouteSelected = jest.fn();
		const cancel = tracker.trackMParticleConversion(
			config,
			createPurchase,
			onRouteSelected,
		);
		cancel();
		consent(true);
		await settle();
		expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
		expect(createPurchase).not.toHaveBeenCalled();
		expect(onRouteSelected).not.toHaveBeenCalled();
	});

	it('does not initialize if consent is withdrawn during the import', async () => {
		const { tracker, loader, sdk, consent } = setup();
		let resolveLoad: ((value: typeof sdk) => void) | undefined;
		loader.loadMParticleSdk.mockReturnValue(
			new Promise((resolve) => {
				resolveLoad = resolve;
			}),
		);
		tracker.trackMParticleConversion(config, () => purchase, jest.fn());
		consent(true);
		await settle();
		expect(loader.loadMParticleSdk).toHaveBeenCalledTimes(1);
		consent(false);
		resolveLoad?.(sdk);
		await settle();
		expect(sdk.initialize).not.toHaveBeenCalled();
		consent(true);
		await settle();
		expect(sdk.logPurchase).not.toHaveBeenCalled();
	});

	it('opts out without dispatch if consent is withdrawn during initialization', async () => {
		const { tracker, sdk, consent } = setup();
		let finishInit: (() => void) | undefined;
		sdk.initialize.mockReturnValue(
			new Promise<void>((resolve) => {
				finishInit = resolve;
			}),
		);
		tracker.trackMParticleConversion(config, () => purchase, jest.fn());
		consent(true);
		await settle();
		consent(false);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		finishInit?.();
		await settle();
		expect(sdk.logPurchase).not.toHaveBeenCalled();
		expect(sdk.setConsent).toHaveBeenLastCalledWith(false);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
	});

	it('discards the purchase when the route leaves during initialization with consent still granted', async () => {
		const { tracker, sdk, consent } = setup();
		let finishInit: (() => void) | undefined;
		sdk.initialize.mockReturnValue(
			new Promise<void>((resolve) => {
				finishInit = resolve;
			}),
		);
		const cancel = tracker.trackMParticleConversion(
			config,
			() => purchase,
			jest.fn(),
		);
		consent(true);
		await settle();
		expect(sdk.initialize).toHaveBeenCalledWith(config);
		cancel();
		finishInit?.();
		await settle();
		expect(sdk.logPurchase).not.toHaveBeenCalled();
		expect(sdk.upload).not.toHaveBeenCalled();
	});

	it('keeps observing withdrawal after dispatch and unmount', async () => {
		const { tracker, sdk, consent } = setup();
		const gtag = jest.fn();
		Object.defineProperty(window, 'gtag', { configurable: true, value: gtag });
		const cancel = tracker.trackMParticleConversion(
			config,
			() => purchase,
			jest.fn(),
		);
		consent(true);
		await settle();
		cancel();
		consent(false);
		expect(sdk.setConsent).toHaveBeenLastCalledWith(false);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		expect(gtag).toHaveBeenCalledWith('consent', 'update', {
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
		});
		consent(true);
		expect(gtag).toHaveBeenCalledWith('consent', 'update', {
			ad_storage: 'granted',
			ad_user_data: 'granted',
			ad_personalization: 'granted',
		});
	});

	it('stops mParticle until reload without changing Google consent when only mParticle is withdrawn', async () => {
		const { tracker, sdk, consent } = setup();
		const gtag = jest.fn();
		Object.defineProperty(window, 'gtag', { configurable: true, value: gtag });
		tracker.trackMParticleConversion(config, () => purchase, jest.fn());
		consent(true);
		await settle();
		consent(true, false, true);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		expect(gtag).not.toHaveBeenCalled();
		consent(true);
		tracker.trackMParticleConversion(
			config,
			() => ({ ...purchase, orderId: 'next-purchase' }),
			jest.fn(),
		);
		await settle();
		expect(sdk.logPurchase).toHaveBeenCalledTimes(1);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		// A later Google withdrawal is still observed while mParticle is stopped.
		consent(false);
		expect(gtag).toHaveBeenCalledWith('consent', 'update', {
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
		});
	});

	it('contains loading failures without dispatch or retry on a consent callback', async () => {
		const { tracker, loader, sdk, consent } = setup();
		loader.loadMParticleSdk.mockRejectedValue(new Error('SDK unavailable'));
		tracker.trackMParticleConversion(config, () => purchase, jest.fn());
		consent(true);
		await settle();
		consent(true);
		await settle();
		expect(loader.loadMParticleSdk).toHaveBeenCalledTimes(1);
		expect(sdk.logPurchase).not.toHaveBeenCalled();
		expect(
			jest.requireMock<typeof Logger>('helpers/utilities/logger').logException,
		).toHaveBeenCalledWith('mParticle conversion tracking failed');
	});
});
