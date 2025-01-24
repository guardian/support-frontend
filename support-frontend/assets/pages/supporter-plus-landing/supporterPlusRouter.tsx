import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { isDetailsSupported, polyfillDetails } from 'helpers/polyfills/details';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import { setUpRedux } from './setup/setUpRedux';
import { threeTierCheckoutEnabled } from './setup/threeTierChecks';
import { ContributionsOnlyLanding } from './twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from './twoStepPages/threeTierLanding';

parseAppConfig(window.guardian);

if (!isDetailsSupported) {
	polyfillDetails();
}

// ----- Redux Store ----- //
const store = initReduxForContributions();

setUpRedux(store);

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

setUpTrackingAndConsents(commonState.abParticipations);

export const inThreeTier = threeTierCheckoutEnabled(
	commonState.abParticipations,
	commonState.amounts,
);

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
										<ThreeTierLanding
											geoId={countryId}
											abParticipations={commonState.abParticipations}
										/>
									) : (
										<ContributionsOnlyLanding geoId={countryId} />
									)
								}
							/>
						</>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

renderPage(router());
