import type { Participations } from 'helpers/abTests/abtest';
import type { ProductPrices } from './assets/helpers/productPrice/productPrices';

declare global {
	/* ~ Here, declare things that go in the global namespace, or augment
	 *~ existing declarations in the global namespace
	 */
	interface Window {
		guardian: {
			mdapiUrl: string;
			serversideTests?: Participations | null;
			enableContributionsCampaign: boolean;
			forceContributionsCampaign: boolean;
			v2recaptchaPublicKey: string;
			recaptchaEnabled?: boolean;
			geoip?: {
				countryCode: string;
				stateCode?: string;
			};
			productPrices: ProductPrices;
			orderIsAGift: boolean;
			amazonPaySellerId: {
				default: string;
				uat: string;
			};
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
