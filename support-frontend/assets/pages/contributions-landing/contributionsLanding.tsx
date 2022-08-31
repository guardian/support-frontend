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
import { enableOrDisableForm } from './checkoutFormIsSubmittableActions';
import ContributionThankYouPage from './components/ContributionThankYou/ContributionThankYouPage';
import { init as formInit } from './contributionsLandingInit';
import { ContributionsLandingPage } from './contributionsLandingPage';
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
// formInit depends on the user being populated
user.init(store.dispatch, setUserStateActions(countryGroupId));
formInit(store);
const reactElementId = `contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;
const { abParticipations } = store.getState().common;

const showNewProductPage = abParticipations.supporterPlus === 'variant';

// ----- Render ----- //

const router = () => {
	const countryIds = ['uk', 'us', 'au', 'eu', 'int', 'nz', 'ca'];

	const landingPage = showNewProductPage ? (
		<SupporterPlusLandingPage />
	) : (
		<ContributionsLandingPage />
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
							element={
								<ContributionThankYouPage countryGroupId={countryGroupId} />
							}
						/>
					))}
				</Routes>
			</Provider>
		</BrowserRouter>
	);
};

const dispatch = store.dispatch;

renderPage(router(), reactElementId, () => dispatch(enableOrDisableForm()));
