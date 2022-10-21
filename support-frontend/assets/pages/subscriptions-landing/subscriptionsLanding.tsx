// ----- Imports ----- //
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Page from 'components/page/page';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import './subscriptionsLanding.scss';
import SubscriptionLandingContent from './components/subscriptionsLandingContent';
import type { SubscriptionsLandingPropTypes } from './subscriptionsLandingProps';
import { subscriptionsLandingProps } from './subscriptionsLandingProps';

// ----- Render ----- //
function SubscriptionsLandingPage({
	countryGroupId,
	participations,
	pricingCopy,
	referrerAcquisitions,
}: SubscriptionsLandingPropTypes) {
	const isNewProduct = participations.newProduct === 'variant';
	const HeaderWithCountrySwitcher = headerWithCountrySwitcherContainer({
		path: '/subscribe',
		countryGroupId,
		listOfCountryGroups: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			Canada,
			NZDCountries,
			International,
		],
		isNewProduct,
	});
	return (
		<Page
			header={
				isNewProduct ? (
					<Header countryGroupId={countryGroupId} isNewProduct={isNewProduct} />
				) : (
					<HeaderWithCountrySwitcher />
				)
			}
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

setUpTrackingAndConsents();
renderPage(
	<SubscriptionsLandingPage {...subscriptionsLandingProps()} />,
	'subscriptions-landing-page',
);
