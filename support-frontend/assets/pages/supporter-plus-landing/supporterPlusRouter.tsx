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

/**
 * Temporary check behind disabled AB test to validate whether
 * window.ApplePaySession.canMakePaymentsWithActiveCard works
 * on support.theguardian.com
 */

const checkCanMakePaymentsWithActiveCard =
	abParticipations.canMakePaymentsWithActiveCard &&
	abParticipations.canMakePaymentsWithActiveCard == 'control';

if (checkCanMakePaymentsWithActiveCard) {
	const merchantIdentifier = 'merchant.uk.co.guardian.contributions';

	const canMakePaymentsWithActiveCard = (): Promise<boolean> => {
		return new Promise((resolve) => {
			if (window.ApplePaySession) {
				void window.ApplePaySession.canMakePaymentsWithActiveCard(
					merchantIdentifier,
				).then((result) => {
					resolve(result);
				});
			} else {
				resolve(false);
			}
		});
	};

	void canMakePaymentsWithActiveCard().then((result) => {
		console.log(`canMakePaymentsWithActiveCard? ${result.toString()}`);
	});
}

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
	const firstStepLandingPage = (
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

renderPage(router(), reactElementId);
