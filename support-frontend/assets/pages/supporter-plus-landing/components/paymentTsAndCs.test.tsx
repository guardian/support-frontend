import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { PaymentTsAndCs } from './paymentTsAndCs';

// Mocking product deliveryDate
jest.mock('pages/[countryGroupId]/checkout/helpers/deliveryDays', () => ({
	getProductFirstDeliveryDate: () => 'Sunday, September 21, 2025',
}));

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};

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
		['GuardianAdLite', 'Monthly', 'GBPCountries', 5],
		['DigitalSubscription', 'Monthly', 'GBPCountries', 18],
		['DigitalSubscription', 'Monthly', 'UnitedStates', 28],
		['Contribution', 'Annual', 'AUDCountries', 100],
		['SupporterPlus', 'Monthly', 'GBPCountries', 12],
		['SupporterPlus', 'Monthly', 'UnitedStates', 15],
		['SupporterPlus', 'OneYearStudent', 'GBPCountries', 9],
		['TierThree', 'RestOfWorldMonthly', 'UnitedStates', 45],
		['HomeDelivery', 'EverydayPlus', 'GBPCountries', 83.99],
		['NationalDelivery', 'EverydayPlus', 'GBPCountries', 83.99],
		['SubscriptionCard', 'EverydayPlus', 'GBPCountries', 69.99],
		['GuardianWeeklyDomestic', 'Monthly', 'GBPCountries', 16.5],
		['GuardianWeeklyRestOfWorld', 'Annual', 'International', 432],
	];
	it.each(paymentProductKeys)(
		`paymentTs&Cs render product %s for period %s in region %s correctly`,
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
					studentDiscount={
						paymentProductKey === 'SupporterPlus' &&
						ratePlanKey === 'OneYearStudent'
							? oneYearStudentDiscount
							: undefined
					}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
