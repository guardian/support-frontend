// ----- Imports ----- //
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import './subscriptionsLanding.scss';
import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import type { SubscriptionsLandingPropTypes } from './subscriptionsLandingProps';
import { subscriptionsLandingProps } from './subscriptionsLandingProps';

// ----- Render ----- //
export function SubscriptionsLandingPage({
	countryGroupId,
	participations,
	pricingCopy,
	referrerAcquisitions,
}: SubscriptionsLandingPropTypes): JSX.Element {
	return (
		<Page
			header={<Header countryGroupId={countryGroupId} />}
			footer={<Footer centred />}
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
