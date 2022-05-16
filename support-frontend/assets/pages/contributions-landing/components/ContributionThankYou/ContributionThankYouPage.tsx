import { Navigate, useLocation } from 'react-router-dom';
import Footer from 'components/footer/footer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import Page from 'components/page/page';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { setOneOffContributionCookie } from 'helpers/storage/contributionsCookies';
import * as storage from 'helpers/storage/storage';
import ContributionThankYou from './ContributionThankYou';
import 'helpers/internationalisation/countryGroup';

type ContributionThankYouProps = {
	countryGroupId: CountryGroupId;
};

function ContributionThankYouPage({
	countryGroupId,
}: ContributionThankYouProps): JSX.Element {
	const paymentMethod = storage.getSession('selectedPaymentMethod');
	const isPaymentMethodSelected = paymentMethod && paymentMethod !== 'None';
	const { pathname, search } = useLocation();
	const queryParams = new URLSearchParams(search);

	if (!isPaymentMethodSelected && !queryParams.has('no-redirect')) {
		const redirectPath = pathname.replace('thankyou', 'contribute') + search;
		return <Navigate to={redirectPath} replace />;
	}

	// we set the recurring cookie server side
	if (storage.getSession('selectedContributionType') === 'ONE_OFF') {
		setOneOffContributionCookie();
	}

	return (
		<Page
			classModifiers={['contribution-thankyou']}
			header={<RoundelHeader />}
			footer={<Footer disclaimer countryGroupId={countryGroupId} />}
		>
			<ContributionThankYou />
		</Page>
	);
}

export default ContributionThankYouPage;
