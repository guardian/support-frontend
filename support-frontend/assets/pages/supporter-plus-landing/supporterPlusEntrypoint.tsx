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
import * as user from 'helpers/user/user';
import { SupporterPlusLandingPage } from 'pages/supporter-plus-landing/supporterPlusLanding';
import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import { setUpRedux } from './setUpRedux';
import { setUserStateActions } from './setUserStateActions';

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

// We need to initialise in this order, as
// setUpRedux depends on the user being populated
user.init(store.dispatch, setUserStateActions(countryGroupId));
setUpRedux(store);

const reactElementId = `contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;
const thankYouRoute = `/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`;
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
						<Route path={`/${countryId}/contribute/`} element={landingPage} />
					))}
					{countryIds.map((countryId) => (
						<Route
							path={`/${countryId}/contribute/:campaignCode`}
							element={landingPage}
						/>
					))}
					{countryIds.map((countryId) => (
						<Route
							path={`/${countryId}/thankyou`}
							element={<SupporterPlusThankYou />}
						/>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router(), reactElementId);
