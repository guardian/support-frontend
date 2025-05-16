import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	const promotionTierThreUnitedStatesMonthly: Promotion = {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	};
	const paymentProductKeys = [
		['GuardianAdLite', BillingPeriod.Monthly, 'GBPCountries', 0],
		['Contribution', BillingPeriod.Annual, 'AUDCountries', 0],
		['SupporterPlus', BillingPeriod.Monthly, 'GBPCountries', 12],
		['TierThree', BillingPeriod.Monthly, 'UnitedStates', 45],
	];
	it.each(paymentProductKeys)(
		`orderSummaryTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, billingPeriod, countryGroupId, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				billingPeriod === 'Monthly' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreUnitedStatesMonthly
					: undefined;
			const { container } = render(
				<OrderSummaryTsAndCs
					productKey={paymentProductKey as ActiveProductKey}
					billingPeriod={billingPeriod as BillingPeriod}
					countryGroupId={countryGroupId as CountryGroupId}
					thresholdAmount={amount as number}
					promotion={promo}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
