// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { useParams } from 'react-router-dom';
import ContributionsFooter from 'components/footerCompliant/ContributionsFooter';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import Page from 'components/page/page';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { ContributionFormContainer } from './components/ContributionFormContainer';
import './contributionsLanding.scss';
import './newContributionsLandingTemplate.scss';

// ----- Render ----- //

const campaignSettings = getCampaignSettings();
const cssModifiers = campaignSettings?.cssModifiers ?? [];
const backgroundImageSrc = campaignSettings?.backgroundImage;
FocusStyleManager.onlyShowFocusOnTabs(); // https://www.theguardian.design/2a1e5182b/p/6691bb-accessibility

export function ContributionsLandingPage({
	countryGroupId,
	thankYouRoute,
}: {
	countryGroupId: CountryGroupId;
	thankYouRoute: string;
}): JSX.Element {
	const { campaignCode } = useParams();
	const selectedCountryGroup = countryGroups[countryGroupId];

	return (
		<Page
			classModifiers={['new-template', 'contribution-form', ...cssModifiers]}
			header={<RoundelHeader selectedCountryGroup={selectedCountryGroup} />}
			footer={<ContributionsFooter />}
			backgroundImageSrc={backgroundImageSrc}
		>
			<ContributionFormContainer
				thankYouRoute={thankYouRoute}
				campaignCodeParameter={campaignCode}
			/>
		</Page>
	);
}
