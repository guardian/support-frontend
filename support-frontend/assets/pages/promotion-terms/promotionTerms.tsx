import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import { detect } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import PromoDetails from 'pages/promotion-terms/promoDetails';
import type { PromotionTermsPropTypes } from './promotionTermsReducer';
import getPromotionTermsProps from './promotionTermsReducer';
import './promotionTerms.scss';

setUpTrackingAndConsents();

function getTermsConditionsLink({ product }: PromotionTerms) {
	if (product === GuardianWeekly) {
		return 'https://www.theguardian.com/guardian-weekly-subscription-terms-conditions';
	}

	return '';
}

// ----- Render ----- //
function PromotionTermsPage(props: PromotionTermsPropTypes) {
	return (
		<Page
			header={<Header countryGroupId={detect()} />}
			footer={
				<Footer
					termsConditionsLink={getTermsConditionsLink(props.promotionTerms)}
				/>
			}
		>
			<PromoDetails {...props.promotionTerms} />
			<LegalTerms {...props} />
		</Page>
	);
}

renderPage(PromotionTermsPage(getPromotionTermsProps()), 'promotion-terms');
