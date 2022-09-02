// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { useParams } from 'react-router-dom';
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
import { gaEvent } from 'helpers/tracking/googleTagManager';
import { ContributionFormContainer } from './components/ContributionFormContainer';
import './contributionsLanding.scss';
import './newContributionsLandingTemplate.scss';

if (!isDetailsSupported) {
	polyfillDetails();
}

setUpTrackingAndConsents();

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

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

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const campaignSettings = getCampaignSettings();
const cssModifiers = campaignSettings?.cssModifiers ?? [];
const backgroundImageSrc = campaignSettings?.backgroundImage;
FocusStyleManager.onlyShowFocusOnTabs(); // https://www.theguardian.design/2a1e5182b/p/6691bb-accessibility

export function ContributionsLandingPage(): JSX.Element {
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
