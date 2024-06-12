// ----- Imports ----- //
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { DigitalSubscriptionLandingPage } from 'pages/digital-subscriber-checkout/digitalSubscriptionLandingPage';
import { DigitalSubscriptionThankYou } from 'pages/digital-subscriber-thank-you/digitalSubscriptionThankYou';
import { setUpRedux } from './setup/setUpRedux';

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const store = initReduxForContributions();

// Brute force override of the Sepa switch, as we can't accept Sepa for digi sub payments
window.guardian.settings = {
	...window.guardian.settings,
	switches: {
		...window.guardian.settings.switches,
		recurringPaymentMethods: {
			...window.guardian.settings.switches.recurringPaymentMethods,
			sepa: 'Off',
		},
	},
};

setUpRedux(store);

const thankYouRoute = 'thankyou';
const countryIds = Object.values(countryGroups).map((group) => group.i18nId);

// ----- Render ----- //

const router = () => {
	const landingPage = (
		<DigitalSubscriptionLandingPage thankYouRoute={thankYouRoute} />
	);

	return (
		<BrowserRouter>
			<Provider store={store}>
				<Routes>
					{countryIds.map((countryId) => (
						<>
							<Route
								path={`/${countryId}/subscribe/digitaledition`}
								element={landingPage}
							/>
							<Route
								path={`/${countryId}/subscribe/digitaledition/thankyou`}
								element={<DigitalSubscriptionThankYou />}
							/>
						</>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router());
