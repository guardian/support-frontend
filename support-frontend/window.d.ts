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
		enablePayPalButton?: () => void;
		disablePayPalButton?: () => void;
		googleTagManagerDataLayer?: Array<Record<string, unknown>>;
		gtag_enable_tcf_support?: boolean;
		QuantumMetricAPI: unknown;
		grecaptcha?: {
			render: (arg0: string, arg1: Record<string, any>) => void;
		};
		v2OnloadCallback: () => void;
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
		__REDUX_DEVTOOLS_EXTENSION__?: () => undefined;
	}
}
/* ~ this line is required as per TypeScript's global-modifying-module.d.ts instructions */
export {};
