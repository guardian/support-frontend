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
	const paymentProductKeys = [
		['GuardianAdLite', BillingPeriod.Annual, 'GBPCountries', 0],
		['DigitalSubscription', BillingPeriod.Monthly, 'GBPCountries', 0],
		['Contribution', BillingPeriod.Annual, 'AUDCountries', 0],
		['SupporterPlus', BillingPeriod.Monthly, 'GBPCountries', 12],
		['TierThree', BillingPeriod.Monthly, 'UnitedStates', 45],
		['HomeDelivery', BillingPeriod.Monthly, 'GBPCountries', 0],
		['NationalDelivery', BillingPeriod.Monthly, 'GBPCountries', 0],
		['SubscriptionCard', BillingPeriod.Monthly, 'GBPCountries', 0],
		['GuardianWeeklyDomestic', BillingPeriod.Monthly, 'GBPCountries', 0],
		['GuardianWeeklyRestOfWorld', BillingPeriod.Annual, 'UnitedStates', 0],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, billingPeriod, countryGroupId, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				billingPeriod === 'MONTHLY' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreeUnitedStatesMonthly
					: paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
					  billingPeriod === 'ANNUAL' &&
					  countryGroupId === 'UnitedStates'
					? promotionGuardianWeeklyUnitedStatesAnnual
					: undefined;
			const { container } = render(
				<PaymentTsAndCs
					billingPeriod={billingPeriod as BillingPeriod}
					ratePlanKey={BillingPeriod.Monthly as ActiveRatePlanKey}
					countryGroupId={countryGroupId as CountryGroupId}
					productKey={paymentProductKey as ActiveProductKey}
					thresholdAmount={amount as number}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
