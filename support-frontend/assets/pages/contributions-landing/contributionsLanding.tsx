// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import type { ThunkDispatch } from 'redux-thunk';
import ContributionsFooter from 'components/footerCompliant/ContributionsFooter';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import Page from 'components/page/page';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
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
import { enableOrDisableForm } from './checkoutFormIsSubmittableActions';
import { ContributionFormContainer } from './components/ContributionFormContainer';
import ContributionThankYouPage from './components/ContributionThankYou/ContributionThankYouPage';
import type { Action } from './contributionsLandingActions';
import { init as formInit } from './contributionsLandingInit';
import type { State } from './contributionsLandingReducer';
import { setUserStateActions } from './setUserStateActions';
import './contributionsLanding.scss';
import './newContributionsLandingTemplate.scss';

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

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const campaignSettings = getCampaignSettings();
const cssModifiers = campaignSettings?.cssModifiers ?? [];
const backgroundImageSrc = campaignSettings?.backgroundImage;
FocusStyleManager.onlyShowFocusOnTabs(); // https://www.theguardian.design/2a1e5182b/p/6691bb-accessibility

function ContributionsLandingPage() {
	const { campaignCode } = useParams();

	return (
		<Page
			classModifiers={['new-template', 'contribution-form', ...cssModifiers]}
			header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
			footer={<ContributionsFooter />}
			backgroundImageSrc={backgroundImageSrc}
		>
			<ContributionFormContainer
				thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
				campaignCodeParameter={campaignCode}
			/>
		</Page>
	);
}

const router = () => {
	const countryIds = ['uk', 'us', 'au', 'eu', 'int', 'nz', 'ca'];

	return (
		<BrowserRouter>
			<Provider store={store}>
				<Routes>
					{countryIds.map((countryId) => (
						<Route
							path={`/${countryId}/contribute/`}
							element={<ContributionsLandingPage />}
						/>
					))}
					{countryIds.map((countryId) => (
						<Route
							path={`/${countryId}/contribute/:campaignCode`}
							element={<ContributionsLandingPage />}
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

const dispatch = store.dispatch as ThunkDispatch<State, void, Action>;

renderPage(router(), reactElementId, () => dispatch(enableOrDisableForm()));
