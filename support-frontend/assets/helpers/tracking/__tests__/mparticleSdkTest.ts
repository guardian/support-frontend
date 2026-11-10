import type { SDKInitConfig } from '@mparticle/web-sdk';
import type { MParticleSdk, Purchase } from '../mparticleSdk';
import { loadMParticleSdk } from '../mparticleSdk';

const mockConsentState = { addGDPRConsentState: jest.fn() };
const mockUser = {
	getConsentState: jest.fn(
		(): typeof mockConsentState | null => mockConsentState,
	),
	setConsentState: jest.fn(),
};
const mockProduct = { Name: 'SupporterPlus', Sku: 'SupporterPlus', Price: 6 };
const mockTransaction = { Id: 'purchase-123', Revenue: 6 };
const mockSdk = {
	init: jest.fn<void, [string, SDKInitConfig]>(),
	ready: jest.fn<void, [() => void]>(),
	setOptOut: jest.fn(),
	upload: jest.fn(),
	Identity: { getCurrentUser: jest.fn((): typeof mockUser | null => mockUser) },
	Consent: {
		createGDPRConsent: jest.fn((Consented: boolean, Timestamp: number) => ({
			Consented,
			Timestamp,
		})),
		createConsentState: jest.fn(() => mockConsentState),
	},
	ProductActionType: { Purchase: 7 },
	eCommerce: {
		createProduct: jest.fn((): typeof mockProduct | null => mockProduct),
		createTransactionAttributes: jest.fn(() => mockTransaction),
		setCurrencyCode: jest.fn(),
		logProductAction: jest.fn(),
	},
};
const mockKit = { register: jest.fn() };

jest.mock('@mparticle/web-sdk', () => ({
	__esModule: true,
	default: mockSdk,
}));
jest.mock('@mparticle/web-adwords-kit', () => ({
	__esModule: true,
	default: mockKit,
}));

describe('mParticle SDK adapter', () => {
	let adapter: MParticleSdk;
	const config = { apiKey: 'test-web-key', isDevelopmentMode: true };
	const purchase: Purchase = {
		orderId: 'purchase-123',
		value: 6,
		currency: 'GBP',
		productType: 'SupporterPlus',
		ratePlan: 'Monthly',
		billingPeriod: 'Monthly',
		contributionType: 'MONTHLY',
		paymentMethod: 'Stripe',
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		adapter = await loadMParticleSdk();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('loads the packages without initializing or registering the kit', () => {
		expect(mockSdk.init).not.toHaveBeenCalled();
		expect(mockKit.register).not.toHaveBeenCalled();
	});

	it('registers the kit with EU configuration and no supplied identities, then waits for readiness', async () => {
		const initialized = adapter.initialize(config);
		expect(mockSdk.init).toHaveBeenCalledWith('test-web-key', {
			isDevelopmentMode: true,
			identifyRequest: { userIdentities: {} },
			logLevel: 'none',
			flags: { autoLogPageView: 'False' },
			v1SecureServiceUrl: 'jssdks.eu1.mparticle.com/v1/JS/',
			v2SecureServiceUrl: 'jssdks.eu1.mparticle.com/v2/JS/',
			v3SecureServiceUrl: 'jssdks.eu1.mparticle.com/v3/JS/',
			identityUrl: 'identity.eu1.mparticle.com/v1/',
			aliasUrl: 'jssdks.eu1.mparticle.com/v1/identity/',
		});
		expect(mockKit.register).toHaveBeenCalledWith(
			mockSdk.init.mock.calls[0]?.[1],
		);
		const onInitialized = jest.fn();
		void initialized.then(onInitialized);
		await Promise.resolve();
		expect(onInitialized).not.toHaveBeenCalled();
		mockSdk.ready.mock.calls[0]?.[0]();
		await initialized;
		expect(onInitialized).toHaveBeenCalledTimes(1);
		expect(jest.getTimerCount()).toBe(0);
	});

	it('rejects SDK readiness without a current user', async () => {
		mockSdk.Identity.getCurrentUser.mockReturnValueOnce(null);
		const initialized = adapter.initialize(config);
		mockSdk.ready.mock.calls[0]?.[0]();
		await expect(initialized).rejects.toThrow('no current user');
	});

	it('rejects when initialization cannot finish', async () => {
		const initialized = adapter.initialize(config);
		const rejected = expect(initialized).rejects.toThrow('timed out');
		await jest.advanceTimersByTimeAsync(10000);
		await rejected;
		expect(mockSdk.setOptOut).toHaveBeenCalledWith(true);
	});

	it('keeps the SDK opted out if readiness arrives after initialization timed out', async () => {
		const initialized = adapter.initialize(config);
		const rejected = expect(initialized).rejects.toThrow('timed out');
		await jest.advanceTimersByTimeAsync(10000);
		await rejected;
		mockSdk.setOptOut.mockClear();
		mockSdk.ready.mock.calls[0]?.[0]();
		expect(mockSdk.setOptOut).toHaveBeenCalledWith(true);
	});

	it('rejects initialization exceptions and clears its timeout', async () => {
		mockSdk.init.mockImplementationOnce(() => {
			throw new Error('SDK failed');
		});
		await expect(adapter.initialize(config)).rejects.toThrow('SDK failed');
		expect(mockSdk.setOptOut).toHaveBeenCalledWith(true);
		expect(jest.getTimerCount()).toBe(0);
	});

	it.each([true, false])(
		'updates advertising consent to %s without replacing other purposes',
		(granted) => {
			adapter.setConsent(granted);
			expect(mockConsentState.addGDPRConsentState).toHaveBeenCalledWith(
				'personalised_advertising',
				{ Consented: granted, Timestamp: Date.now() },
			);
			expect(mockUser.setConsentState).toHaveBeenCalledWith(mockConsentState);
			expect(mockSdk.Consent.createConsentState).not.toHaveBeenCalled();
		},
	);

	it('creates the initial consent state for a new SDK user', () => {
		mockUser.getConsentState.mockReturnValueOnce(null);
		adapter.setConsent(true);
		expect(mockSdk.Consent.createConsentState).toHaveBeenCalledTimes(1);
		expect(mockUser.setConsentState).toHaveBeenCalledWith(mockConsentState);
	});

	it('maps purchase data to a commerce purchase without personal identifiers', () => {
		const purchaseWithContactData = {
			...purchase,
			email: 'member@example.com',
			identityId: 'member-123',
		};
		adapter.logPurchase(purchaseWithContactData);
		expect(mockSdk.eCommerce.createProduct).toHaveBeenCalledWith(
			'SupporterPlus',
			'SupporterPlus',
			6,
			1,
		);
		expect(mockSdk.eCommerce.createTransactionAttributes).toHaveBeenCalledWith(
			'purchase-123',
			undefined,
			undefined,
			6,
		);
		expect(mockSdk.eCommerce.setCurrencyCode).toHaveBeenCalledWith('GBP');
		expect(mockSdk.eCommerce.logProductAction).toHaveBeenCalledWith(
			7,
			[mockProduct],
			{
				productType: 'SupporterPlus',
				ratePlan: 'Monthly',
				billingPeriod: 'Monthly',
				conversionKey: 'SupporterPlus:Monthly',
				contributionType: 'MONTHLY',
				paymentMethod: 'Stripe',
			},
			undefined,
			mockTransaction,
		);
	});

	it('does not log a purchase rejected by the SDK product factory', () => {
		mockSdk.eCommerce.createProduct.mockReturnValueOnce(null);
		expect(() => adapter.logPurchase(purchase)).toThrow(
			'Invalid mParticle purchase',
		);
		expect(mockSdk.eCommerce.logProductAction).not.toHaveBeenCalled();
	});

	it.each([
		{
			productType: 'DigitalSubscription',
			ratePlan: 'ThreeMonthGift',
			billingPeriod: 'Quarterly',
			contributionType: 'QUARTERLY',
			conversionKey: 'DigitalSubscription:ThreeMonthGift',
		},
		{
			productType: 'Contribution',
			ratePlan: 'OneTime',
			billingPeriod: 'OneTime',
			contributionType: 'ONE_OFF',
			conversionKey: 'Contribution:OneTime',
		},
	])(
		'keeps the $conversionKey routing key distinct',
		({ conversionKey, ...plan }) => {
			adapter.logPurchase({ ...purchase, ...plan });
			expect(mockSdk.eCommerce.logProductAction).toHaveBeenCalledWith(
				7,
				[mockProduct],
				{ ...plan, conversionKey, paymentMethod: 'Stripe' },
				undefined,
				mockTransaction,
			);
		},
	);

	it('exposes opt-out and upload for the consent-aware caller', () => {
		adapter.setOptOut(true);
		adapter.upload();
		expect(mockSdk.setOptOut).toHaveBeenCalledWith(true);
		expect(mockSdk.upload).toHaveBeenCalledTimes(1);
	});
});
