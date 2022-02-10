import type { Participations } from 'helpers/abTests/abtest';
import type { StripeKey } from 'helpers/forms/stripe';
import type { User } from 'helpers/user/userReducer';
import type { ProductPrices } from './assets/helpers/productPrice/productPrices';

declare global {
	/* ~ Here, declare things that go in the global namespace, or augment
	 *~ existing declarations in the global namespace
	 */
	interface Window {
		guardian: {
			amazonPayClientId: {
				default: string;
				uat: string;
			};
			amazonPaySellerId: {
				default: string;
				uat: string;
			};
			email?: string;
			enableContributionsCampaign: boolean;
			forceContributionsCampaign: boolean;
			geoip?: {
				countryCode: string;
				stateCode?: string;
			};
			gitCommitId?: string;
			mdapiUrl: string;
			orderIsAGift: boolean;
			paymentApiPayPalEndpoint: string;
			paymentApiUrl: string;
			payPalEnvironment: {
				default: string;
				uat: string;
			};
			polyfillScriptLoaded?: boolean;
			polyfillVersion?: string;
			productPrices: ProductPrices;
			recaptchaEnabled?: boolean;
			serversideTests?: Participations | null;
			stripeKeyAustralia: StripeKey;
			stripeKeyDefaultCurrencies: StripeKey;
			stripeKeyUnitedStates: StripeKey;
			uatMode?: boolean;
			user?: User;
			v2recaptchaPublicKey: string;
		};

		amazon?: {
			Login: {
				setClientId: (clientId: string) => void;
				setSandboxMode: (sandboxMode: boolean) => void;
			};
		};
		disablePayPalButton?: () => void;
		enablePayPalButton?: () => void;
		googleTagManagerDataLayer?: Array<Record<string, unknown>>;
		grecaptcha?: {
			render: (arg0: string, arg1: Record<string, unknown>) => void;
		};
		gtag_enable_tcf_support?: boolean;
		OffAmazonPayments?: Record<string, unknown>;
		onAmazonLoginReady: unknown;
		onAmazonPaymentsReady: () => void;
		paypal: {
			FUNDING: {
				CREDIT: unknown;
			};
		};
		QuantumMetricAPI: unknown;
		v2OnloadCallback: () => void;
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
		__REDUX_DEVTOOLS_EXTENSION__?: () => undefined;
	}
}
/* ~ this line is required as per TypeScript's global-modifying-module.d.ts instructions */
export {};
