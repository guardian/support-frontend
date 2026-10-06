import { GBPCountries } from '@modules/internationalisation/countryGroup';
import { ClientSideErrorHandler } from 'components/ClientSideError';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import { PromoTermsProvider } from 'contexts/PromoTermsContext';
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
	productCatalog,
	promotions,
	promoCode,
	promotionCopy,
	fulfilment,
}: PaperLandingPropTypes) {
	const sanitisedPromoCopy = getSanitisedPromoCopy(promotionCopy);
	return (
		<PageScaffold
			id={pageQaId}
			header={<Header countryGroupId={GBPCountries} />}
			footer={paperSubsFooter}
		>
			<NewspaperHero
				promotionCopy={sanitisedPromoCopy}
				paperHeroItems={getPaperPlusItems(productCatalog)}
			/>
			<NewspaperProductTabs
				productCatalog={productCatalog}
				promotions={promotions}
				promoCode={promoCode}
				fulfilment={fulfilment}
			/>
		</PageScaffold>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(
	<ClientSideErrorHandler>
		<PromoTermsProvider>
			<PaperLandingPage {...paperLandingProps(abParticipations)} />
		</PromoTermsProvider>
	</ClientSideErrorHandler>,
);
