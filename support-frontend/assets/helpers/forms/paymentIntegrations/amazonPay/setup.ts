import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { isProd } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import type { AmazonLoginObject, AmazonPaymentsObject } from './types';

// ---- Setup ---- //

export const setupAmazonPay = (
	countryGroupId: CountryGroupId,
	onAmazonLoginReady: (loginObject: AmazonLoginObject) => void,
	onAmazonPaymentsReady: (paymentsObject: AmazonPaymentsObject) => void,
	isTestUser: boolean,
): void => {
	const isSandbox = isTestUser || !isProd();

	if (isSupportedCountryGroup(countryGroupId)) {
		setupAmazonPayCallbacks(
			countryGroupId,
			onAmazonLoginReady,
			onAmazonPaymentsReady,
			isSandbox,
		);
		loadAmazonPayScript(isSandbox);
	}
};

// ---- Helpers ---- //

const amazonPaySupportedCountryGroups = ['UnitedStates'];

const isSupportedCountryGroup = (countryGroupId: CountryGroupId) =>
	amazonPaySupportedCountryGroups.includes(countryGroupId);

// Amazon Pay callbacks - called after Widgets.js has loaded
const setupAmazonPayCallbacks = (
	countryGroupId: CountryGroupId,
	onAmazonLoginReady: (loginObject: AmazonLoginObject) => void,
	onAmazonPaymentsReady: (paymentsObject: AmazonPaymentsObject) => void,
	isSandbox: boolean,
): void => {
	window.onAmazonLoginReady = () => {
		if (window.amazon?.Login) {
			const amazonLoginObject = window.amazon.Login;
			const amazonRegion = getAmazonRegion(countryGroupId, amazonLoginObject);

			if (amazonRegion) {
				const clientId = getAmazonPayClientId(isSandbox);
				amazonLoginObject.setClientId(clientId);

				if (isSandbox) {
					amazonLoginObject.setSandboxMode(true);
				}

				onAmazonLoginReady(window.amazon.Login);
			}
		}
	};

	window.onAmazonPaymentsReady = () => {
		if (window.OffAmazonPayments) {
			onAmazonPaymentsReady(window.OffAmazonPayments);
		}
	};
};

const loadAmazonPayScript = (isSandbox: boolean): void => {
	// Amazon pay requires us to use a different script for sandbox mode
	const widgetsUrl = isSandbox
		? 'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js'
		: 'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';

	new Promise((_resolve, reject) => {
		const script = document.createElement('script');
		script.onerror = reject;
		script.src = widgetsUrl;

		document.head.appendChild(script);
	}).catch((error) => {
		logException(`Error loading ${widgetsUrl}`, error);
	});
};

const getAmazonRegion = (
	countryGroupId: CountryGroupId,
	amazonLoginObject: {
		setClientId?: (clientId: string) => void;
		setSandboxMode?: (sandboxMode: boolean) => void;
		Region?: { NorthAmerica?: string };
	},
): string | null | undefined => {
	switch (countryGroupId) {
		case 'UnitedStates':
			return amazonLoginObject.Region?.NorthAmerica;

		default:
			// Currently only US is supported
			return undefined;
	}
};

const getAmazonPayClientId = (isSandbox: boolean): string =>
	isSandbox
		? window.guardian.amazonPayClientId.uat
		: window.guardian.amazonPayClientId.default;
