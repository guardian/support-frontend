import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { lowerBenefitsThresholds } from 'helpers/supporterPlus/benefitsThreshold';

export const supporterPlusLegal = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	divider: string,
	promotion?: Promotion,
) => {
	const currencyGlyph = glyph(detect(countryGroupId));
	const tierPlanCost = `${currencyGlyph}${lowerBenefitsThresholds[countryGroupId][contributionType]}`;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const planCostNoPromo = `${tierPlanCost}${divider}${period}`;
	if (promotion?.discountedPrice && promotion.numberOfDiscountedPeriods) {
		// EXAMPLE: £16/month for the first 12 months, then £25/month
		const discountTierPlanCost = `${currencyGlyph}${promotion.discountedPrice}`;
		const discountDuration = promotion.numberOfDiscountedPeriods;
		return `${discountTierPlanCost}${divider}${period} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${period}${discountDuration > 1 ? 's' : ''}, then ${planCostNoPromo}`;
	}
	return planCostNoPromo;
};
