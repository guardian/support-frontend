import React from 'react';
import { renderPage } from 'helpers/rendering/render';
import './promotionTerms.scss';
import { initRedux, setUpTrackingAndConsents } from 'helpers/page/page';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import PromoDetails from 'pages/promotion-terms/promoDetails';
import type { State } from './promotionTermsReducer';
import reducer from './promotionTermsReducer';
import Page from 'components/page/page';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { Provider } from 'react-redux';
import { detect } from 'helpers/internationalisation/countryGroup';

setUpTrackingAndConsents();
// ----- Redux Store ----- //
const store = initRedux(() => reducer, true);

function getTermsConditionsLink({ product }: PromotionTerms) {
	if (product === DigitalPack) {
		return 'https://www.theguardian.com/digital-subscriptions-terms-conditions';
	} else if (product === GuardianWeekly) {
		return 'https://www.theguardian.com/guardian-weekly-subscription-terms-conditions';
	}

	return '';
}

// ----- Render ----- //
const PromotionTermsPage = (props: State) => (
	<Provider store={store}>
		<Page
			header={<Header countryGroupId={detect()} />}
			footer={
				<Footer
					termsConditionsLink={getTermsConditionsLink(
						props.page.promotionTerms,
					)}
				/>
			}
		>
			<PromoDetails {...props.page.promotionTerms} />
			<LegalTerms {...props.page} />
		</Page>
	</Provider>
);

renderPage(PromotionTermsPage(store.getState()), 'promotion-terms');
