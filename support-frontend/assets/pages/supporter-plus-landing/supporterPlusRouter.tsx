// ----- Imports ----- //
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import { setUpRedux } from './setup/setUpRedux';
import { threeTierCheckoutEnabled } from './setup/threeTierChecks';
import { SupporterPlusInitialLandingPage } from './twoStepPages/firstStepLanding';
import { SupporterPlusCheckout } from './twoStepPages/secondStepCheckout';
import { ThreeTierLanding } from './twoStepPages/threeTierLanding';

parseAppConfig(window.guardian);

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

function ScrollToTop(): null {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

const commonState = store.getState().common;

export const inThreeTier = threeTierCheckoutEnabled(
	commonState.abParticipations,
	commonState.amounts,
);

// ----- Render ----- //

const router = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Provider store={store}>
				<Routes>
					{countryIds.map((countryId) => (
						<>
							<Route
								path={`/${countryId}/contribute/:campaignCode?`}
								element={
									inThreeTier ? (
										<ThreeTierLanding geoId={countryId} />
									) : (
										<SupporterPlusInitialLandingPage
											thankYouRoute={thankYouRoute}
										/>
									)
								}
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
