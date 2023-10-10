// ----- Imports ----- //
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	detect,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { SupporterPlusLandingPage } from 'pages/supporter-plus-landing/supporterPlusLanding';
import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import { setUpRedux } from './setup/setUpRedux';
import { SupporterPlusInitialLandingPage } from './twoStepTest/firstStepLanding';
import { SupporterPlusCheckout } from './twoStepTest/secondStepCheckout';

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const store = initReduxForContributions();

setUpRedux(store);

const reactElementId = `supporter-plus-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;
const thankYouRoute = `/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`;
const countryIds = Object.values(countryGroups).map(
	(group) => group.supportInternationalisationId,
);

const {
	common: { abParticipations },
} = store.getState();

const isInTwoStepTest =
	abParticipations.twoStepCheckoutWithNudgeBelow &&
	abParticipations.twoStepCheckoutWithNudgeBelow !== 'control';

console.log(abParticipations);
const showCheckoutTopUpToggle =
	abParticipations.twoStepCheckoutWithNudgeBelow === 'variant_b';

// ----- ScrollToTop on Navigate: https://v5.reactrouter.com/web/guides/scroll-restoration ---- //

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

// ----- Render ----- //

const router = () => {
	const landingPage = (
		<SupporterPlusLandingPage thankYouRoute={thankYouRoute} />
	);

	const firstStepLandingPage = (
		<SupporterPlusInitialLandingPage thankYouRoute={thankYouRoute} />
	);

	const oneStepRoutes = countryIds.map((countryId) => (
		<>
			<Route path={`/${countryId}/contribute/`} element={landingPage} />
			<Route
				path={`/${countryId}/contribute/:campaignCode`}
				element={landingPage}
			/>
			<Route
				path={`/${countryId}/thankyou`}
				element={<SupporterPlusThankYou />}
			/>
		</>
	));

	const twoStepRoutes = countryIds.map((countryId) => (
		<>
			<Route
				path={`/${countryId}/contribute/`}
				element={firstStepLandingPage}
			/>
			<Route
				path={`/${countryId}/contribute/:campaignCode`}
				element={firstStepLandingPage}
			/>
			<Route
				path={`/${countryId}/contribute/checkout`}
				element={
					<SupporterPlusCheckout
						thankYouRoute={thankYouRoute}
						showTopUpToggle={showCheckoutTopUpToggle}
					/>
				}
			/>
			<Route
				path={`/${countryId}/thankyou`}
				element={<SupporterPlusThankYou />}
			/>
		</>
	));

	return (
		<BrowserRouter>
			<ScrollToTop />
			<Provider store={store}>
				<Routes>{isInTwoStepTest ? twoStepRoutes : oneStepRoutes}</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router(), reactElementId);
