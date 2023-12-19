// ----- Imports ----- //
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CountryGroup } from 'helpers/internationalisation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import { setUpRedux } from './setup/setUpRedux';
import { SupporterPlusInitialLandingPage } from './twoStepPages/firstStepLanding';
import { SupporterPlusCheckout } from './twoStepPages/secondStepCheckout';
import { ThreeTierLanding } from './twoStepPages/threeTierLanding';

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = CountryGroup.detect();
const store = initReduxForContributions();

setUpRedux(store);

const thankYouRoute = `/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`;
const countryIds = Object.values(countryGroups).map(
	(group) => group.supportInternationalisationId,
);

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
	const {
		common: { abParticipations },
	} = store.getState();
	const isInThreeTierCheckoutTest =
		abParticipations.threeTierCheckout === 'variant';
	const firstStepLandingPage = isInThreeTierCheckoutTest ? (
		<ThreeTierLanding />
	) : (
		<SupporterPlusInitialLandingPage thankYouRoute={thankYouRoute} />
	);

	return (
		<BrowserRouter>
			<ScrollToTop />
			<Provider store={store}>
				<Routes>
					{countryIds.map((countryId) => (
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
									<SupporterPlusCheckout thankYouRoute={thankYouRoute} />
								}
							/>
							<Route
								path={`/${countryId}/thankyou`}
								element={<SupporterPlusThankYou />}
							/>
						</>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router());
