import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { isProd } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import {
	setAmazonPayLoginObject,
	setAmazonPayPaymentsObject,
} from 'pages/contributions-landing/contributionsLandingActions';

const amazonPaySupportedCountryGroups = ['UnitedStates'];

const getAmazonRegion = (
	countryGroupId: CountryGroupId,
	amazonLoginObject: Record<string, any>,
): string | null | undefined => {
	switch (countryGroupId) {
		case 'UnitedStates':
			return amazonLoginObject.Region.NorthAmerica;

		default:
			// Currently only US is supported
			return undefined;
	}
};

const getAmazonPayClientId = (isSandbox: boolean): string =>
	isSandbox
		? window.guardian.amazonPayClientId.uat
		: window.guardian.amazonPayClientId.default;

// Amazon Pay callbacks - called after Widgets.js has loaded
const setupAmazonPayCallbacks = (
	countryGroupId: CountryGroupId,
	dispatch: (...args: any[]) => any,
	isSandbox: boolean,
): void => {
	window.onAmazonLoginReady = () => {
		if (window.amazon && window.amazon.Login) {
			const amazonLoginObject = window.amazon.Login;
			const amazonRegion = getAmazonRegion(countryGroupId, amazonLoginObject);

			if (amazonRegion) {
				const clientId = getAmazonPayClientId(isSandbox);
				amazonLoginObject.setClientId(clientId);

				if (isSandbox) {
					amazonLoginObject.setSandboxMode(true);
				}

				dispatch(setAmazonPayLoginObject(window.amazon.Login));
			}
		}
	};

	window.onAmazonPaymentsReady = () => {
		if (window.OffAmazonPayments) {
			dispatch(setAmazonPayPaymentsObject(window.OffAmazonPayments));
		}
	};
};

const loadAmazonPayScript = (isSandbox: boolean): void => {
	// Amazon pay requires us to use a different script for sandbox mode
	const widgetsUrl = isSandbox
		? 'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js'
		: 'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';
	new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.onerror = reject;
		script.src = widgetsUrl;

		if (document.head) {
			document.head.appendChild(script);
		}
	}).catch((error) => {
		logException(`Error loading ${widgetsUrl}`, error);
	});
};

const setupAmazonPay = (
	countryGroupId: CountryGroupId,
	dispatch: (...args: any[]) => any,
	isTestUser: boolean,
): void => {
	const isSandbox = isTestUser || !isProd();

	if (amazonPaySupportedCountryGroups.includes(countryGroupId)) {
		setupAmazonPayCallbacks(countryGroupId, dispatch, isSandbox);
		loadAmazonPayScript(isSandbox);
	}
};

export { setupAmazonPay };
