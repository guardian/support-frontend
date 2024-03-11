import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { isRecurring } from './isContributionRecurring';

export type ThresholdAmounts = Record<RegularContributionType, number>;
export const upperBenefitsThresholds: Record<CountryGroupId, ThresholdAmounts> =
	{
		GBPCountries: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		UnitedStates: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		EURCountries: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		International: {
			MONTHLY: 22,
			ANNUAL: 150,
		},
		AUDCountries: {
			MONTHLY: 30,
			ANNUAL: 170,
		},
		NZDCountries: {
			MONTHLY: 30,
			ANNUAL: 170,
		},
		Canada: {
			MONTHLY: 22,
			ANNUAL: 150,
		},
	};

const lowerBenefitsThresholds: Record<CountryGroupId, ThresholdAmounts> = {
	GBPCountries: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	UnitedStates: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
	EURCountries: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	International: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
	AUDCountries: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	NZDCountries: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	Canada: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
};
export function getLowerBenefitsThresholds(
	countryGroupId: CountryGroupId,
	skipPromo?: boolean,
): ThresholdAmounts {
	if (!skipPromo) {
		const promotionMonthly = useContributionsSelector((state) =>
			getPromotion(
				state.page.checkoutForm.product.productPrices,
				state.common.internationalisation.countryId,
				'Monthly',
			),
		);
		const promotionAnnual = useContributionsSelector((state) =>
			getPromotion(
				state.page.checkoutForm.product.productPrices,
				state.common.internationalisation.countryId,
				'Annual',
			),
		);
		return {
			MONTHLY:
				promotionMonthly?.discountedPrice ??
				lowerBenefitsThresholds[countryGroupId].MONTHLY,
			ANNUAL:
				promotionAnnual?.discountedPrice ??
				lowerBenefitsThresholds[countryGroupId].ANNUAL,
		};
	}
	return lowerBenefitsThresholds[countryGroupId];
}

// This is a function overload that means if the caller has already determined that contributionType is recurring
// they do not have to handle an undefined return type from getThresholdPrice
// cf. https://www.typescriptlang.org/docs/handbook/2/functions.html#overload-signatures-and-the-implementation-signature

// Signatures
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: 'ONE_OFF',
	promotion?: Promotion,
): undefined;
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	promotion?: Promotion,
): number;
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	promotion?: Promotion,
): number | undefined;
// Implementation
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	promotion?: Promotion,
): number | undefined {
	if (isRecurring(contributionType)) {
		const countryGroupThresholds = lowerBenefitsThresholds[countryGroupId];
		const threshold = promotion
			? promotion.discountedPrice
			: countryGroupThresholds[contributionType];
		return threshold;
	}
}
