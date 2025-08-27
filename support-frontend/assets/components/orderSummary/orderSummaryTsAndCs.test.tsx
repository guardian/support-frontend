import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

describe('orderSummaryTs&Cs Snapshot comparison', () => {
	const promotionTierThreeUnitedStatesMonthly: Promotion = {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	};

	type OrderSummaryTestParams = [
		ActiveProductKey,
		CountryGroupId,
		ActiveRatePlanKey,
		string | undefined,
		number,
	];

	const orderSummaryProductKeys: OrderSummaryTestParams[] = [
		['GuardianAdLite', 'GBPCountries', 'Monthly', undefined, 0],
		['Contribution', 'AUDCountries', 'Annual', undefined, 0],
		['SupporterPlus', 'GBPCountries', 'Monthly', undefined, 12],
		['SupporterPlus', 'GBPCountries', 'OneYearStudent', undefined, 9],
		['TierThree', 'UnitedStates', 'RestOfWorldMonthly', undefined, 45],
		[
			'SubscriptionCard',
			'GBPCountries',
			'WeekendPlus',
			'Weekend package',
			69.99,
		],
		['HomeDelivery', 'GBPCountries', 'SixdayPlus', 'Six day package', 83.99],
		['SubscriptionCard', 'GBPCountries', 'Sunday', 'The Observer', 15.99],
		['HomeDelivery', 'GBPCountries', 'Sunday', 'The Observer', 20.99],
	];
	it.each(orderSummaryProductKeys)(
		`orderSummaryTs&Cs render product %s for region %s for ratePlan %s correctly`,
		(
			paymentProductKey,
			countryGroupId,
			activeRatePlanKey,
			ratePlanDescription,
			amount,
		) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				activeRatePlanKey === 'RestOfWorldMonthly' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreeUnitedStatesMonthly
					: undefined;
			const { container } = render(
				<OrderSummaryTsAndCs
					productKey={paymentProductKey}
					ratePlanKey={activeRatePlanKey}
					ratePlanDescription={ratePlanDescription}
					countryGroupId={countryGroupId}
					thresholdAmount={amount}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
