import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

export const isWeeklyGiftSub = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	return (
		['GuardianWeeklyDomestic', 'GuardianWeeklyRestOfWorld'].includes(
			productKey,
		) && ['OneYearGift', 'ThreeMonthGift'].includes(ratePlanKey)
	);
};
