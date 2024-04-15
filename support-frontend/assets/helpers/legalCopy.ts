import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	detect,
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getLowerBenefitThreshold } from 'helpers/supporterPlus/benefitsThreshold';

export const supporterPlusLegal = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	divider: string,
	promotion?: Promotion,
) => {
	const currencyGlyph = glyph(detect(countryGroupId));
	const tierPlanCost = `${currencyGlyph}${getLowerBenefitThreshold(
		contributionType,
		fromCountryGroupId(countryGroupId),
	)}`;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const planCostNoPromo = `${tierPlanCost}${divider}${period}`;
	const promoPrice = promotion?.discountedPrice;
	if (promoPrice && promotion.numberOfDiscountedPeriods) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPriceRounded =
			promoPrice % 1 === 0 ? promoPrice : promoPrice.toFixed(2);
		const discountTierPlanCost = `${currencyGlyph}${promoPriceRounded}`;
		const discountDuration = promotion.numberOfDiscountedPeriods;
		return `${discountTierPlanCost}${divider}${period} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${period}${discountDuration > 1 ? 's' : ''}, then ${planCostNoPromo}`;
	}
	return planCostNoPromo;
};
