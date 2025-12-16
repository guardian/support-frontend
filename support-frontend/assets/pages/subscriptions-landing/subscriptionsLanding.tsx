// ----- Imports ----- //
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import 'stylesheets/skeleton/skeleton.scss';
import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import type { SubscriptionsLandingProps } from './subscriptionsLandingProps';
import { subscriptionsLandingProps } from './subscriptionsLandingProps';

// ----- Render ----- //
export function SubscriptionsLandingPage({
	countryGroupId,
	participations,
	pricingCopy,
	referrerAcquisitions,
}: SubscriptionsLandingProps) {
	return (
		<Page
			header={<Header countryGroupId={countryGroupId} />}
			footer={<Footer centred fullWidth />}
		>
			<SubscriptionLandingContent
				countryGroupId={countryGroupId}
				participations={participations}
				pricingCopy={pricingCopy}
				referrerAcquisitions={referrerAcquisitions}
			/>
		</Page>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(
	<SubscriptionsLandingPage {...subscriptionsLandingProps(abParticipations)} />,
);
