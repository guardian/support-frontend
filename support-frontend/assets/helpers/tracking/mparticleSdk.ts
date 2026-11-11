import type {
	MParticleWebSDK,
	SDKECommerceAPI,
	SDKInitConfig,
	SDKProduct,
} from '@mparticle/web-sdk';

type MParticleSdkConfig = {
	apiKey: string;
	isDevelopmentMode: boolean;
};

export type Purchase = {
	orderId: string;
	value: number;
	currency: string;
	productType: string;
	ratePlan: string;
	billingPeriod: string;
	contributionType: string;
	paymentMethod: string;
};

export type MParticleSdk = {
	initialize: (config: MParticleSdkConfig) => Promise<void>;
	setConsent: (granted: boolean) => void;
	setOptOut: (isOptingOut: boolean) => void;
	logPurchase: (purchase: Purchase) => void;
	upload: () => void;
};

type GDPRConsent = { Consented: boolean; Timestamp?: number };
type ConsentState = {
	addGDPRConsentState: (purpose: string, consent: GDPRConsent) => void;
};
type ConsentUser = {
	getConsentState: () => ConsentState | null;
	setConsentState: (consent: ConsentState) => void;
};
type TransactionAttributes = { Id: string | number; Revenue?: string | number };

// SDK 2.81.0 exports runtime types but references missing legacy consent/user
// types. Keep that incomplete part of the package boundary explicitly typed.
type RuntimeSdk = Pick<
	MParticleWebSDK,
	'init' | 'ready' | 'setOptOut' | 'upload' | 'ProductActionType'
> & {
	Identity: { getCurrentUser: () => ConsentUser | null };
	Consent: {
		createGDPRConsent: (
			granted: boolean,
			timestamp: number,
		) => GDPRConsent | null;
		createConsentState: () => ConsentState;
	};
	eCommerce: Pick<SDKECommerceAPI, 'createProduct' | 'setCurrencyCode'> & {
		createTransactionAttributes: (
			id: string,
			affiliation: undefined,
			couponCode: undefined,
			revenue: number,
		) => TransactionAttributes | null;
		logProductAction: (
			action: MParticleWebSDK['ProductActionType']['Purchase'],
			products: SDKProduct[],
			attributes: Record<string, string>,
			customFlags: undefined,
			transaction: TransactionAttributes,
		) => void;
	};
};

export async function loadMParticleSdk(): Promise<MParticleSdk> {
	const [sdkModule, kitModule] = await Promise.all([
		import('@mparticle/web-sdk'),
		import('@mparticle/web-adwords-kit'),
	]);
	// The package has a runtime default export that its bundled declarations omit.
	const sdk = (sdkModule as unknown as { default: RuntimeSdk }).default;

	return {
		initialize: ({ apiKey, isDevelopmentMode }) =>
			new Promise<void>((resolve, reject) => {
				let failed = false;
				const fail = (error: unknown) => {
					failed = true;
					window.clearTimeout(timeout);
					// Before readiness the SDK queues this opt-out for initialization.
					sdk.setOptOut(true);
					reject(error);
				};
				const timeout = window.setTimeout(() => {
					fail(new Error('mParticle SDK initialization timed out'));
				}, 10000);
				const config: SDKInitConfig & {
					identifyRequest: { userIdentities: Record<string, never> };
				} = {
					isDevelopmentMode,
					identifyRequest: { userIdentities: {} },
					logLevel: 'none',
					flags: { autoLogPageView: 'False' },
					v1SecureServiceUrl: 'jssdks.eu1.mparticle.com/v1/JS/',
					v2SecureServiceUrl: 'jssdks.eu1.mparticle.com/v2/JS/',
					v3SecureServiceUrl: 'jssdks.eu1.mparticle.com/v3/JS/',
					identityUrl: 'identity.eu1.mparticle.com/v1/',
					aliasUrl: 'jssdks.eu1.mparticle.com/v1/identity/',
				};
				try {
					kitModule.default.register(config);
					sdk.init(apiKey, config);
					sdk.ready(() => {
						window.clearTimeout(timeout);
						if (failed) {
							sdk.setOptOut(true);
							return;
						}
						if (sdk.Identity.getCurrentUser()) {
							resolve();
						} else {
							fail(new Error('mParticle SDK has no current user'));
						}
					});
				} catch (error) {
					fail(error);
				}
			}),
		setConsent: (granted) => {
			const user = sdk.Identity.getCurrentUser();
			const consent = sdk.Consent.createGDPRConsent(granted, Date.now());
			if (!user || !consent) {
				throw new Error(
					'Cannot update mParticle consent before initialization',
				);
			}
			const state = user.getConsentState() ?? sdk.Consent.createConsentState();
			state.addGDPRConsentState('personalised_advertising', consent);
			user.setConsentState(state);
		},
		setOptOut: (isOptingOut) => sdk.setOptOut(isOptingOut),
		logPurchase: ({
			orderId,
			value,
			currency,
			productType,
			ratePlan,
			billingPeriod,
			contributionType,
			paymentMethod,
		}) => {
			const product = sdk.eCommerce.createProduct(
				productType,
				productType,
				value,
				1,
			);
			const transaction = sdk.eCommerce.createTransactionAttributes(
				orderId,
				undefined,
				undefined,
				value,
			);
			if (!product || !transaction) {
				throw new Error('Invalid mParticle purchase data');
			}
			sdk.eCommerce.setCurrencyCode(currency);
			sdk.eCommerce.logProductAction(
				sdk.ProductActionType.Purchase,
				[product],
				{
					productType,
					ratePlan,
					billingPeriod,
					conversionKey: `${productType}:${ratePlan}`,
					contributionType,
					paymentMethod,
				},
				undefined,
				transaction,
			);
		},
		upload: () => sdk.upload(),
	};
}
