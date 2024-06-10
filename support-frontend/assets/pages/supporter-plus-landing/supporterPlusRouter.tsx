// ----- Imports ----- //
import { lazy, Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import {
	BrowserRouter,
	// Navigate,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import { validateWindowGuardian } from 'helpers/globalsAndSwitches/window';
import { CountryGroup } from 'helpers/internationalisation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
// import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import { setUpRedux } from './setup/setUpRedux';
import { threeTierCheckoutEnabled } from './setup/threeTierChecks';
// import { SupporterPlusInitialLandingPage } from './twoStepPages/firstStepLanding';
// import { SupporterPlusCheckout } from './twoStepPages/secondStepCheckout';
import { ThreeTierLanding } from './twoStepPages/threeTierLanding';

validateWindowGuardian(window.guardian);

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = CountryGroup.detect();
const store = initReduxForContributions();

setUpRedux(store);

const urlParams = new URLSearchParams(window.location.search);
const promoCode = urlParams.get('promoCode');
const thankYouRouteParams = promoCode
	? `?${new URLSearchParams({ promoCode }).toString()}`
	: '';
const thankYouRoute = `/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou${thankYouRouteParams}`;
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

// type ThreeTierRedirectProps = {
// 	children: React.ReactNode;
// 	countryId: string;
// };
// function ThreeTierRedirectOneOffToCheckout({
// 	children,
// 	countryId,
// }: ThreeTierRedirectProps) {
// 	const urlParams = new URLSearchParams(window.location.search);
// 	const urlSelectedContributionType = urlParams.get(
// 		'selected-contribution-type',
// 	);
// 	const urlParamsString = urlParams.toString();
// 	const oneOff = urlSelectedContributionType === 'ONE_OFF';

// 	return oneOff ? (
// 		<Navigate
// 			to={`/${countryId}/contribute/checkout${`${
// 				urlParamsString ? `?${urlParamsString}` : ''
// 			}${window.location.hash}`}`}
// 			replace
// 		/>
// 	) : (
// 		<>{children}</>
// 	);
// }

const commonState = store.getState().common;

export const inThreeTier = threeTierCheckoutEnabled(
	commonState.abParticipations,
	commonState.amounts,
);

// Lazy load your components
// const ThreeTierLanding = lazy(() => import('./twoStepPages/threeTierLanding'));
const SupporterPlusCheckout = lazy(
	() => import('./twoStepPages/secondStepCheckout'),
);
const SupporterPlusThankYou = lazy(
	() => import('pages/supporter-plus-thank-you/supporterPlusThankYou'),
);

console.log('***');

// ----- Render ----- //

const router = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Provider store={store}>
				<Suspense fallback={<ThreeTierLanding />}>
					<Routes>
						{countryIds.map((countryId) => (
							<>
								<Route
									path={`/${countryId}/contribute/:campaignCode?`}
									element={<ThreeTierLanding />}
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
				</Suspense>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router());
