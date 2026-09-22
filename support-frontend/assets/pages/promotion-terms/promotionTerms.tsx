import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import PromoDetails from 'pages/promotion-terms/promoDetails';
import { getSubscriptionProduct } from './promotionSelectors';
import type { PromotionTermsPropTypes } from './promotionTermsPropTypes';

setUpTrackingAndConsents(getAbParticipations());

function getTermsConditionsLink(promotion?: PromoWithCatalogInformation) {
	if (!promotion) {
		return '';
	}

	const product = getSubscriptionProduct(promotion.appliesTo.catalogRatePlans);
	if (product === DigitalPack) {
		return 'https://www.theguardian.com/digital-subscriptions-terms-conditions';
	} else if (product === GuardianWeekly) {
		return 'https://www.theguardian.com/guardian-weekly-subscription-terms-conditions';
	}

	return '';
}

function getPromotionTermsProps(): PromotionTermsPropTypes {
	const [promotion] = window.guardian.promotions ?? [];

	return {
		promotion,
		countryGroupId: CountryGroup.detect(),
	};
}

// ----- Render ----- //
export function PromotionTermsPage(props: PromotionTermsPropTypes) {
	return (
		<PageScaffold
			header={<Header countryGroupId={CountryGroup.detect()} />}
			footer={
				<Footer termsConditionsLink={getTermsConditionsLink(props.promotion)} />
			}
		>
			<PromoDetails promotion={props.promotion} />
			<LegalTerms {...props} />
		</PageScaffold>
	);
}

renderPage(<PromotionTermsPage {...getPromotionTermsProps()} />);
