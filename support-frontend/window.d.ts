import type { ComponentType } from 'react';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type {
	AmazonObject,
	AmazonPaymentsObject,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import type { StripeKey } from 'helpers/forms/stripe';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { SendEventId } from 'helpers/tracking/quantumMetric';
import type { User } from 'helpers/user/userReducer';

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
			csrf?: Csrf;
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
			settings: Settings;
			stripeKeyAustralia: StripeKey;
			stripeKeyDefaultCurrencies: StripeKey;
			stripeKeyUnitedStates: StripeKey;
			uatMode?: boolean;
			user?: User;
			v2recaptchaPublicKey: string;
		};

		amazon?: AmazonObject;
		disablePayPalButton?: () => void;
		enablePayPalButton?: () => void;
		googleTagManagerDataLayer?: Array<Record<string, unknown>>;
		grecaptcha?: {
			render: (arg0: string, arg1: Record<string, unknown>) => void;
		};
		gtag_enable_tcf_support?: boolean;
		OffAmazonPayments?: AmazonPaymentsObject;
		onAmazonLoginReady: unknown;
		onAmazonPaymentsReady: () => void;
		paypal: {
			FUNDING: {
				CREDIT: unknown;
			};
			Button: {
				driver: (
					name: 'react',
					{ React, ReactDOM }: { React: unknown; ReactDOM: unknown },
				) => ComponentType;
			};
		};
		QuantumMetricAPI?: {
			isOn: () => boolean;
			sendEvent: (id: SendEventId, isConversion: 0 | 1, value: string) => void;
			currencyConvertFromToValue: (
				value: number,
				sourceCurrency: IsoCurrency,
				targetCurrency: IsoCurrency,
			) => number;
		};
		v2OnloadCallback: () => void;
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
		__REDUX_DEVTOOLS_EXTENSION__?: () => undefined;
	}
}
/* ~ this line is required as per TypeScript's global-modifying-module.d.ts instructions */
export {};
