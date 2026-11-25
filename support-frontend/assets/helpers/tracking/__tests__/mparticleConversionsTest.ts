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
// Give the dynamic import and the mocked SDK promises a turn to resolve.
const flushDispatchPromises = () =>
	new Promise<void>((resolve) => setTimeout(resolve, 0));

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
		preparePurchase: jest.fn(),
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
	it.each`
		name                    | enabled  | configured                    | expected
		${'enabled with a key'} | ${true}  | ${config}                     | ${true}
		${'switch is off'}      | ${false} | ${config}                     | ${false}
		${'missing config'}     | ${true}  | ${undefined}                  | ${false}
		${'blank key'}          | ${true}  | ${{ ...config, apiKey: ' ' }} | ${false}
	`(
		'can use mParticle is $expected when $name',
		({
			enabled,
			configured,
			expected,
		}: {
			enabled: boolean;
			configured: typeof config | undefined;
			expected: boolean;
		}) => {
			const { tracker } = setup();
			expect(tracker.canUseMParticleConversions(enabled, configured)).toBe(
				expected,
			);
		},
	);

	it.each`
		name                                 | canTarget | mparticle | remarketing | expectedRoute
		${'vendor grants without targeting'} | ${false}  | ${true}   | ${true}     | ${'mparticle'}
		${'mParticle is denied'}             | ${true}   | ${false}  | ${true}     | ${'gtm'}
		${'Google remarketing is denied'}    | ${true}   | ${true}   | ${false}    | ${'gtm'}
	`(
		'uses $expectedRoute when $name and GTM is allowed',
		async ({
			canTarget,
			mparticle,
			remarketing,
			expectedRoute,
		}: {
			canTarget: boolean;
			mparticle: boolean;
			remarketing: boolean;
			expectedRoute: 'gtm' | 'mparticle';
		}) => {
			const { tracker, loader, sdk, consent } = setup();
			const createPurchase = jest.fn(() => purchase);
			const onRouteSelected = jest.fn();
			tracker.trackMParticleConversion(config, createPurchase, onRouteSelected);
			expect(createPurchase).not.toHaveBeenCalled();
			expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
			consent(canTarget, mparticle, remarketing, true);
			await flushDispatchPromises();
			expect(onRouteSelected).toHaveBeenCalledWith(expectedRoute);
			expect(onRouteSelected).toHaveBeenCalledTimes(1);
			if (expectedRoute === 'gtm') {
				expect(createPurchase).not.toHaveBeenCalled();
				expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
				expect(sdk.initialize).not.toHaveBeenCalled();
				return;
			}
			expect(createPurchase).toHaveBeenCalledTimes(1);
			expect(sdk.initialize).toHaveBeenCalledWith(config);
			expect(sdk.setConsent).toHaveBeenCalledWith(true);
			expect(sdk.logPurchase).toHaveBeenCalledWith(purchase);
			expect(sdk.upload).toHaveBeenCalledTimes(1);
		},
	);

	it('waits for permission and sends one purchase across remounts', async () => {
		const { tracker, loader, sdk, consent } = setup();
		const createPurchase = jest.fn(() => purchase);
		const onRouteSelected = jest.fn();
		tracker.trackMParticleConversion(config, createPurchase, onRouteSelected);
		consent(true, false, true, false);
		expect(createPurchase).not.toHaveBeenCalled();
		expect(loader.loadMParticleSdk).not.toHaveBeenCalled();
		expect(onRouteSelected).not.toHaveBeenCalled();

		consent(true);
		await flushDispatchPromises();
		expect(onRouteSelected).toHaveBeenCalledWith('mparticle');
		expect(sdk.logPurchase).toHaveBeenCalledWith(purchase);
		tracker.trackMParticleConversion(config, () => purchase, jest.fn());
		await flushDispatchPromises();
		expect(sdk.logPurchase).toHaveBeenCalledTimes(1);
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
		await flushDispatchPromises();
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
		await flushDispatchPromises();
		expect(loader.loadMParticleSdk).toHaveBeenCalledTimes(1);
		consent(false);
		resolveLoad?.(sdk);
		await flushDispatchPromises();
		expect(sdk.initialize).not.toHaveBeenCalled();
		consent(true);
		await flushDispatchPromises();
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
		await flushDispatchPromises();
		consent(false);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		finishInit?.();
		await flushDispatchPromises();
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
		await flushDispatchPromises();
		expect(sdk.initialize).toHaveBeenCalledWith(config);
		cancel();
		finishInit?.();
		await flushDispatchPromises();
		expect(sdk.logPurchase).not.toHaveBeenCalled();
		expect(sdk.upload).not.toHaveBeenCalled();
	});

	it.each(['pagehide', 'visibilitychange'])(
		'uses GTM once on %s during SDK initialization',
		async (event) => {
			const { tracker, sdk, consent } = setup();
			let finishInit: (() => void) | undefined;
			sdk.initialize.mockReturnValue(
				new Promise<void>((resolve) => {
					finishInit = resolve;
				}),
			);
			const onRouteSelected = jest.fn();
			const cancel = tracker.trackMParticleConversion(
				config,
				() => purchase,
				onRouteSelected,
			);
			consent(true);
			await flushDispatchPromises();
			expect(sdk.initialize).toHaveBeenCalledWith(config);
			expect(onRouteSelected).not.toHaveBeenCalled();

			if (event === 'visibilitychange') {
				const visibility = jest
					.spyOn(document, 'visibilityState', 'get')
					.mockReturnValue('hidden');
				document.dispatchEvent(new Event(event));
				visibility.mockRestore();
			} else {
				window.dispatchEvent(new Event(event));
			}
			expect(onRouteSelected).toHaveBeenCalledWith('gtm');
			window.dispatchEvent(new Event('pagehide'));
			finishInit?.();
			await flushDispatchPromises();
			cancel();
			expect(onRouteSelected).toHaveBeenCalledTimes(1);
			expect(sdk.logPurchase).not.toHaveBeenCalled();
		},
	);

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
		await flushDispatchPromises();
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
		await flushDispatchPromises();
		consent(true, false, true);
		expect(sdk.setOptOut).toHaveBeenLastCalledWith(true);
		expect(gtag).not.toHaveBeenCalled();
		consent(true);
		tracker.trackMParticleConversion(
			config,
			() => ({ ...purchase, orderId: 'next-purchase' }),
			jest.fn(),
		);
		await flushDispatchPromises();
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

	it('uses GTM once when the SDK fails to load', async () => {
		const { tracker, loader, sdk, consent } = setup();
		loader.loadMParticleSdk.mockRejectedValue(new Error('SDK unavailable'));
		const onRouteSelected = jest.fn();
		tracker.trackMParticleConversion(config, () => purchase, onRouteSelected);
		consent(true);
		await flushDispatchPromises();
		consent(true);
		await flushDispatchPromises();
		expect(loader.loadMParticleSdk).toHaveBeenCalledTimes(1);
		expect(sdk.logPurchase).not.toHaveBeenCalled();
		expect(onRouteSelected).toHaveBeenCalledTimes(1);
		expect(onRouteSelected).toHaveBeenCalledWith('gtm');
		expect(
			jest.requireMock<typeof Logger>('helpers/utilities/logger').logException,
		).toHaveBeenCalledWith('mParticle conversion tracking failed');
	});
});
