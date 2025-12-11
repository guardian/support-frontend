import { GBPCountries } from '@modules/internationalisation/countryGroup';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import NewspaperHero from './components/NewspaperHero';
import NewspaperProductTabs from './components/NewspaperProductTabs';
import { getPaperPlusItems } from './helpers/PaperHeroCopy';
import type { PaperLandingPropTypes } from './paperSubscriptionLandingProps';
import { paperLandingProps } from './paperSubscriptionLandingProps';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';

const paperSubsFooter = (
	<Footer termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions" />
);

const pageQaId = 'qa-paper-subscriptions'; // Selenium test ID

export function PaperLandingPage({
	productPrices,
	promotionCopy,
	fulfilment,
}: PaperLandingPropTypes) {
	if (!productPrices) {
		return null;
	}
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
	return (
		<Page
			id={pageQaId}
			header={<Header countryGroupId={GBPCountries} />}
			footer={paperSubsFooter}
		>
			<NewspaperHero
				promotionCopy={sanitisedPromoCopy}
				paperHeroItems={getPaperPlusItems(productPrices)}
			/>
			<NewspaperProductTabs
				productPrices={productPrices}
				fulfilment={fulfilment}
			/>
		</Page>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(<PaperLandingPage {...paperLandingProps(abParticipations)} />);
