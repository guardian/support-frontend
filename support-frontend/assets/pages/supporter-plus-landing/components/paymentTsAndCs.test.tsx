import { render } from '@testing-library/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { PaymentTsAndCs } from './paymentTsAndCs';

describe('Payment Ts&Cs Snapshot comparison', () => {
	const promotionTierThreeUnitedStatesMonthly: Promotion = {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	};
	const promotionGuardianWeeklyUnitedStatesAnnual: Promotion = {
		name: '10% off for 12 months',
		description: 'Guardian Weekly United States Annual',
		promoCode: 'ANNUAL10',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 324,
	};

	type PaymentProductTestParams = [
		ActiveProductKey,
		BillingPeriod,
		ActiveRatePlanKey,
		CountryGroupId,
		number,
	];

	const paymentProductKeys: PaymentProductTestParams[] = [
		['GuardianAdLite', BillingPeriod.Annual, 'Annual', 'GBPCountries', 0],
		[
			'DigitalSubscription',
			BillingPeriod.Monthly,
			'Monthly',
			'GBPCountries',
			0,
		],
		['Contribution', BillingPeriod.Annual, 'Annual', 'AUDCountries', 0],
		['SupporterPlus', BillingPeriod.Monthly, 'Monthly', 'GBPCountries', 12],
		['TierThree', BillingPeriod.Monthly, 'Monthly', 'UnitedStates', 45],
		['HomeDelivery', BillingPeriod.Monthly, 'Monthly', 'GBPCountries', 0],
		['NationalDelivery', BillingPeriod.Monthly, 'Monthly', 'GBPCountries', 0],
		['SubscriptionCard', BillingPeriod.Monthly, 'Monthly', 'GBPCountries', 0],
		[
			'GuardianWeeklyDomestic',
			BillingPeriod.Monthly,
			'Monthly',
			'GBPCountries',
			0,
		],
		[
			'GuardianWeeklyRestOfWorld',
			BillingPeriod.Annual,
			'Annual',
			'International',
			0,
		],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, billingPeriod, ratePlanKey, countryGroupId, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				billingPeriod === BillingPeriod.Monthly &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreeUnitedStatesMonthly
					: paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
					  billingPeriod === BillingPeriod.Annual &&
					  countryGroupId === 'UnitedStates'
					? promotionGuardianWeeklyUnitedStatesAnnual
					: undefined;
			const { container } = render(
				<PaymentTsAndCs
					productKey={paymentProductKey}
					ratePlanKey={ratePlanKey}
					billingPeriod={billingPeriod}
					countryGroupId={countryGroupId}
					thresholdAmount={amount}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
