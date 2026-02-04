import { GBPCountries } from '@modules/internationalisation/countryGroup';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { getSanitisedPromoCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import NewspaperHero from './components/NewspaperHero';
import NewspaperProductTabs from './components/NewspaperProductTabs';
import { getPaperPlusItems } from './helpers/PaperHeroCopy';
import type { PaperLandingPropTypes } from './paperSubscriptionLandingProps';
import { paperLandingProps } from './paperSubscriptionLandingProps';

const paperSubsFooter = (
	<Footer
		termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions"
		fullWidth
	/>
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
	const sanitisedPromoCopy = getSanitisedPromoCopy(promotionCopy);
	return (
		<PageScaffold
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
		</PageScaffold>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(<PaperLandingPage {...paperLandingProps(abParticipations)} />);
