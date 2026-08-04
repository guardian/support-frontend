// ----- Imports ----- //
import { ClientSideErrorHandler } from 'components/ClientSideError';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import type { SubscriptionsLandingProps } from './subscriptionsLandingProps';
import { subscriptionsLandingProps } from './subscriptionsLandingProps';

// ----- Render ----- //
export function SubscriptionsLandingPage({
	supportRegionId,
	participations,
	pricingCopy,
	referrerAcquisitions,
}: SubscriptionsLandingProps) {
	return (
		<PageScaffold
			header={<Header supportRegionId={supportRegionId} />}
			footer={<Footer centred fullWidth />}
		>
			<SubscriptionLandingContent
				supportRegionId={supportRegionId}
				participations={participations}
				pricingCopy={pricingCopy}
				referrerAcquisitions={referrerAcquisitions}
			/>
		</PageScaffold>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(
	<ClientSideErrorHandler>
		<SubscriptionsLandingPage
			{...subscriptionsLandingProps(abParticipations)}
		/>
		,
	</ClientSideErrorHandler>,
);
