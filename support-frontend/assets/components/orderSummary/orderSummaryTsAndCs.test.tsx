import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

describe('orderSummaryTs&Cs Snapshot comparison', () => {
	const promotionTierThreUnitedStatesMonthly: Promotion = {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	};
	const paymentProductKeys = [
		['GuardianAdLite', 'GBPCountries', 'Monthly', 0],
		['Contribution', 'AUDCountries', 'Annual', 0],
		['SupporterPlus', 'Monthly', 'GBPCountries', 'Monthly', 12],
		['TierThree', 'Monthly', 'UnitedStates', 'Monthly', 45],
	];
	it.each(paymentProductKeys)(
		`orderSummaryTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, countryGroupId, activeRatePlanKey, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				activeRatePlanKey === 'Monthly' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreUnitedStatesMonthly
					: undefined;
			const { container } = render(
				<OrderSummaryTsAndCs
					productKey={paymentProductKey as ActiveProductKey}
					ratePlanKey={activeRatePlanKey as ActiveRatePlanKey}
					countryGroupId={countryGroupId as CountryGroupId}
					thresholdAmount={amount as number}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
