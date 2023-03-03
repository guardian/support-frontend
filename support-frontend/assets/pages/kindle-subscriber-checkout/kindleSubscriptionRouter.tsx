// ----- Imports ----- //
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	detect,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import { SupporterPlusLandingPage } from 'pages/kindle-subscriber-checkout/kindleSubscriptionLandingPage';
import { KindleSubscriptionThankYou } from 'pages/kindle-subscriber-thank-you/kindleSubscriptionThankYou';
import { setUpRedux } from './setup/setUpRedux';

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const store = initReduxForContributions();

if (!window.guardian.polyfillScriptLoaded) {
	gaEvent({
		category: 'polyfill',
		action: 'not loaded',
		label: window.guardian.polyfillVersion ?? '',
	});
}

if (typeof Object.values !== 'function') {
	gaEvent({
		category: 'polyfill',
		action: 'Object.values not available after polyfill',
		label: window.guardian.polyfillVersion ?? '',
	});
}

window.guardian.settings = {
	...window.guardian.settings,
	// @ts-expect-error - The types for the switches object are all kinds of janky and we just need to override the Sepa switch
	switches: {
		...window.guardian.settings.switches,
		recurringPaymentMethods: {
			...window.guardian.settings.switches.recurringPaymentMethods,
			sepa: 'Off',
		},
	},
};

setUpRedux(store);

const reactElementId = `digital-subscription-checkout-page-${countryGroups[countryGroupId].supportInternationalisationId}`;
const thankYouRoute = 'thankyou';
const countryIds = Object.values(countryGroups).map(
	(group) => group.supportInternationalisationId,
);

// ----- Render ----- //

const router = () => {
	const landingPage = (
		<SupporterPlusLandingPage thankYouRoute={thankYouRoute} />
	);

	return (
		<BrowserRouter>
			<Provider store={store}>
				<Routes>
					{countryIds.map((countryId) => (
						<Route path={`/${countryId}/kindle`} element={landingPage} />
					))}
					{countryIds.map((countryId) => (
						<Route
							path={`/${countryId}/kindle/thankyou`}
							element={<KindleSubscriptionThankYou />}
						/>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router(), reactElementId);
