import type { ComponentType, React } from 'react';
import type { Participations } from 'helpers/abTests/models';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { SendEventId } from 'helpers/tracking/quantumMetric';
import type { User } from 'helpers/user/user';
import { IsoCurrency } from '@modules/internationalisation/currency';
import type { TickerName } from './assets/helpers/globalsAndSwitches/landingPageSettings';
import type { TickerData } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';

declare global {
	/* ~ Here, declare things that go in the global namespace, or augment
	 *~ existing declarations in the global namespace
	 */

	type PayPalButtonProps = {
		env: string;
		style: Record<string, string | boolean>;
		commit: boolean;
		validate: (actions: { enable: () => void; disable: () => void }) => void;
		funding: {
			disallowed: unknown[];
		};
		onClick: () => void;
		// This function is called when user clicks the PayPal button.
		payment: (
			resolve: (arg0: string) => void,
			reject: (error: Error) => void,
		) => void;
		// This function is called when the user finishes with PayPal interface (approves payment).
		onAuthorize: (data: Record<string, unknown>) => void | Promise<void>;
		onError?: () => void;
	};

	interface Window {
		guardian: AppConfig & {
			email?: string;
			gitCommitId?: string;
			orderIsAGift: boolean;
			productPrices?: ProductPrices;
			allProductPrices?: {
				SupporterPlus: ProductPrices;
				TierThree: ProductPrices;
			};
			serversideTests?: Participations | null;
			settings: Settings;
			testMode?: boolean;
			user?: User;
			tickerData?: {
				[key in TickerName]: TickerData;
			};
		};

		disablePayPalButton?: () => void;
		enablePayPalButton?: () => void;
		googleTagManagerDataLayer?: Array<Record<string, unknown>>;
		grecaptcha?: {
			render: (arg0: string, arg1: Record<string, unknown>) => number;
			reset: (id: number | undefined) => void;
		};
		gtag_enable_tcf_support?: boolean;
		paypal: {
			FUNDING: {
				CREDIT: unknown;
			};
			Button: {
				driver: (
					name: 'react',
					{ React, ReactDOM }: { React: React; ReactDOM: typeof ReactDOM },
				) => ComponentType<PayPalButtonProps>;
			};
		};
		QuantumMetricAPI?: {
			isOn: () => boolean;
			sendEvent: (
				id: SendEventId,
				isConversion: 0 | 1 | 64,
				value: string,
				payload?: Record<string, unknown>,
			) => void;
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
