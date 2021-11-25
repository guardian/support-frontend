// ----- Imports ----- //
import React from 'react';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import Page from 'components/page/page';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { EmptyContributionFormContainer } from './components/ContributionFormContainer';

/**
 * This must be in a separate file (not contributionsLanding.jsx) because we do not want to initialise the redux store
 */
export function EmptyContributionsLandingPage() {
	return (
		<Page
			classModifiers={['new-template', 'contribution-form']}
			header={
				<RoundelHeader selectedCountryGroup={countryGroups.GBPCountries} />
			}
		>
			<EmptyContributionFormContainer />
		</Page>
	);
}
