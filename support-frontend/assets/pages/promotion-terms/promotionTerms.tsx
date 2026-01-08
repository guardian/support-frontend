import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	getGlobal,
	getProductPrices,
} from 'helpers/globalsAndSwitches/globals';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import PromoDetails from 'pages/promotion-terms/promoDetails';
import './promotionTerms.scss';
import type { PromotionTermsPropTypes } from './promotionTermsPropTypes';

setUpTrackingAndConsents(getAbParticipations());

function getTermsConditionsLink({ product }: PromotionTerms) {
	if (product === DigitalPack) {
		return 'https://www.theguardian.com/digital-subscriptions-terms-conditions';
	} else if (product === GuardianWeekly) {
		return 'https://www.theguardian.com/guardian-weekly-subscription-terms-conditions';
	}

	return '';
}

function getPromotionTermsProps(): PromotionTermsPropTypes {
	const productPrices = getProductPrices() as ProductPrices;
	const terms = getGlobal<PromotionTerms>('promotionTerms');
	const expires = terms?.expires ? new Date(terms.expires) : null;
	const starts = terms ? new Date(terms.starts) : new Date();
	const countryGroupId = CountryGroup.detect();
	return {
		productPrices,
		promotionTerms: { ...terms, starts, expires } as PromotionTerms,
		countryGroupId,
	};
}

// ----- Render ----- //
export function PromotionTermsPage(props: PromotionTermsPropTypes) {
	return (
		<Page
			header={<Header countryGroupId={CountryGroup.detect()} />}
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

renderPage(<PromotionTermsPage {...getPromotionTermsProps()} />);
