import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { isRecurring } from './isContributionRecurring';

export function getLowerBenefitsThreshold(
	state: ContributionsState,
	regularContributionType?: RegularContributionType,
	currencyId?: IsoCurrency,
): number {
	const contributionType =
		regularContributionType ?? getContributionType(state);
	const currency = currencyId ?? state.common.internationalisation.currencyId;
	return getLowerBenefitThreshold(contributionType, currency);
}

export function getLowerBenefitThreshold(
	contributionType: ContributionType,
	currencyId: IsoCurrency,
): number {
	const supporterPlusRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	return (
		productCatalog.SupporterPlus?.ratePlans[supporterPlusRatePlan]?.pricing[
			currencyId
		] ?? 0
	);
}

export function getLowerProductBenefitThreshold(
	contributionType: ContributionType,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroup,
	product: ActiveProductKey,
): number {
	const ratePlanTier3 =
		countryGroupId === 'International'
			? contributionType === 'ANNUAL'
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: contributionType === 'ANNUAL'
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	const ratePlanSupporterPlus =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';

	return (
		productCatalog[product]?.ratePlans[
			product === 'SupporterPlus' ? ratePlanSupporterPlus : ratePlanTier3
		]?.pricing[currencyId] ?? 0
	);
}

// This is a function overload that means if the caller has already determined that contributionType is recurring
// they do not have to handle an undefined return type from getThresholdPrice
// cf. https://www.typescriptlang.org/docs/handbook/2/functions.html#overload-signatures-and-the-implementation-signature

// Signatures
export function getThresholdPrice(
	contributionType: 'ONE_OFF',
	state: ContributionsState,
): undefined;
export function getThresholdPrice(
	contributionType: RegularContributionType,
	state: ContributionsState,
): number;
export function getThresholdPrice(
	contributionType: ContributionType,
	state: ContributionsState,
): number | undefined;
// Implementation
export function getThresholdPrice(
	contributionType: ContributionType,
	state: ContributionsState,
): number | undefined {
	if (isRecurring(contributionType)) {
		return getLowerBenefitsThreshold(state);
	}

	return;
}
