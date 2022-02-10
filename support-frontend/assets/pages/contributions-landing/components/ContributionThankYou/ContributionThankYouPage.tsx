import * as React from 'react';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import Page from 'components/page/page';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ContributionThankYou from './ContributionThankYou';
import 'helpers/internationalisation/countryGroup';

type ContributionThankYouProps = {
	countryGroupId: CountryGroupId;
};

const ContributionThankYouPage: React.FC<ContributionThankYouProps> = ({
	countryGroupId,
}: ContributionThankYouProps) => (
	<Page
		classModifiers={['contribution-thankyou']}
		header={<RoundelHeader />}
		footer={<Footer disclaimer countryGroupId={countryGroupId} />}
	>
		<ContributionThankYou />
	</Page>
);

export default ContributionThankYouPage;
