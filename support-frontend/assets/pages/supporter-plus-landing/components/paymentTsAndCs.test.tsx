import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
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
		ActiveRatePlanKey,
		CountryGroupId,
		number,
	];

	const paymentProductKeys: PaymentProductTestParams[] = [
		['GuardianAdLite', 'Annual', 'GBPCountries', 0],
		['DigitalSubscription', 'Monthly', 'GBPCountries', 0],
		['Contribution', 'Annual', 'AUDCountries', 0],
		['SupporterPlus', 'Monthly', 'GBPCountries', 12],
		['SupporterPlus', 'OneYearStudent', 'GBPCountries', 9],
		['TierThree', 'RestOfWorldMonthly', 'UnitedStates', 45],
		['HomeDelivery', 'Monthly', 'GBPCountries', 0],
		['NationalDelivery', 'Monthly', 'GBPCountries', 0],
		['SubscriptionCard', 'Monthly', 'GBPCountries', 0],
		['GuardianWeeklyDomestic', 'Monthly', 'GBPCountries', 0],
		['GuardianWeeklyRestOfWorld', 'Annual', 'International', 0],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for region %s correctly`,
		(paymentProductKey, ratePlanKey, countryGroupId, amount) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'TierThree' &&
				ratePlanKey === 'RestOfWorldMonthly' &&
				countryGroupId === 'UnitedStates'
					? promotionTierThreeUnitedStatesMonthly
					: paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
					  ratePlanKey === 'Annual' &&
					  countryGroupId === 'UnitedStates'
					? promotionGuardianWeeklyUnitedStatesAnnual
					: undefined;
			const { container } = render(
				<PaymentTsAndCs
					productKey={paymentProductKey}
					ratePlanKey={ratePlanKey}
					countryGroupId={countryGroupId}
					thresholdAmount={amount}
					studentDiscount={{
						fullPriceWithCurrency: '£120',
						amount: 9,
						periodNoun: 'year',
						discountPriceWithCurrency: '£9',
					}}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
