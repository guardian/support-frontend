import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getProductDescription } from 'helpers/productCatalog';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import {
	DigitalPack,
	GuardianWeekly,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import LegalTerms from 'pages/promotion-terms/legalTerms';
import PromoDetails from 'pages/promotion-terms/promoDetails';
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

// Maps a product catalog key onto the small set of products this page distinguishes between.
function productForCatalogKey(productKey: string): SubscriptionProduct {
	if (productKey === 'DigitalSubscription') {
		return DigitalPack;
	}
	if (
		productKey === 'GuardianWeeklyDomestic' ||
		productKey === 'GuardianWeeklyRestOfWorld'
	) {
		return GuardianWeekly;
	}
	return Paper;
}

function promotionTermsFromCachedPromotion(
	promotion: PromoWithCatalogInformation,
): PromotionTerms {
	const matches = promotion.appliesTo.catalogRatePlans;
	const [firstMatch] = matches;
	const product = firstMatch
		? productForCatalogKey(firstMatch.productKey)
		: DigitalPack;

	const productRatePlans = matches.map(({ productKey, productRatePlanKey }) => {
		try {
			const description = getProductDescription(
				productKey as ActiveProductKey,
				productRatePlanKey as ActiveRatePlanKey,
			);
			return (
				description.label +
				', ' +
				(description.ratePlans[productRatePlanKey]?.displayName ??
					productRatePlanKey)
			);
		} catch {
			return productRatePlanKey;
		}
	});

	const isGift =
		matches.length > 0 &&
		matches.every(({ productRatePlanKey }) =>
			productRatePlanKey.includes('Gift'),
		);

	return {
		promoCode: promotion.promoCode,
		description: promotion.description ?? '',
		starts: new Date(promotion.startTimestamp),
		expires: promotion.endTimestamp ? new Date(promotion.endTimestamp) : null,
		product,
		productRatePlans,
		isGift,
	};
}

function getPromotionTermsProps(): PromotionTermsPropTypes {
	const [promotion] = window.guardian.promotions ?? [];
	const countryGroupId = CountryGroup.detect();

	const promotionTerms: PromotionTerms = promotion
		? promotionTermsFromCachedPromotion(promotion)
		: {
				promoCode: '',
				description: '',
				starts: new Date(),
				expires: null,
				product: DigitalPack,
				productRatePlans: [],
				isGift: false,
		  };

	return {
		promotionTerms,
		countryGroupId,
	};
}

// ----- Render ----- //
export function PromotionTermsPage(props: PromotionTermsPropTypes) {
	return (
		<PageScaffold
			header={<Header countryGroupId={CountryGroup.detect()} />}
			footer={
				<Footer
					termsConditionsLink={getTermsConditionsLink(props.promotionTerms)}
				/>
			}
		>
			<PromoDetails {...props.promotionTerms} />
			<LegalTerms {...props} />
		</PageScaffold>
	);
}

renderPage(<PromotionTermsPage {...getPromotionTermsProps()} />);
