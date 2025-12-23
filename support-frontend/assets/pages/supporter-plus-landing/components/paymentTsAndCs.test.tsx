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

	type PaymentProductTestParams = {
		paymentProductKey: ActiveProductKey;
		ratePlanKey: ActiveRatePlanKey;
		countryGroupId: CountryGroupId;
		amount: number;
		amountWithCurrency: string;
	};

	const paymentProductKeys: PaymentProductTestParams[] = [
		{
			paymentProductKey: 'GuardianAdLite',
			ratePlanKey: 'Monthly',
			countryGroupId: 'GBPCountries',
			amount: 5,
			amountWithCurrency: '£5',
		},
		{
			paymentProductKey: 'DigitalSubscription',
			ratePlanKey: 'Monthly',
			countryGroupId: 'GBPCountries',
			amount: 18,
			amountWithCurrency: '£18',
		},
		{
			paymentProductKey: 'DigitalSubscription',
			ratePlanKey: 'Monthly',
			countryGroupId: 'UnitedStates',
			amount: 28,
			amountWithCurrency: '$28',
		},
		{
			paymentProductKey: 'Contribution',
			ratePlanKey: 'Annual',
			countryGroupId: 'AUDCountries',
			amount: 100,
			amountWithCurrency: '$100',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			countryGroupId: 'GBPCountries',
			amount: 12,
			amountWithCurrency: '£12',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			countryGroupId: 'UnitedStates',
			amount: 15,
			amountWithCurrency: '$15',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'OneYearStudent',
			countryGroupId: 'GBPCountries',
			amount: 9,
			amountWithCurrency: '£9',
		},
		{
			paymentProductKey: 'TierThree',
			ratePlanKey: 'RestOfWorldMonthly',
			countryGroupId: 'UnitedStates',
			amount: 45,
			amountWithCurrency: '$45',
		},
		{
			paymentProductKey: 'HomeDelivery',
			ratePlanKey: 'EverydayPlus',
			countryGroupId: 'GBPCountries',
			amount: 83.99,
			amountWithCurrency: '£83.99',
		},
		{
			paymentProductKey: 'NationalDelivery',
			ratePlanKey: 'EverydayPlus',
			countryGroupId: 'GBPCountries',
			amount: 83.99,
			amountWithCurrency: '£83.99',
		},
		{
			paymentProductKey: 'SubscriptionCard',
			ratePlanKey: 'EverydayPlus',
			countryGroupId: 'GBPCountries',
			amount: 69.99,
			amountWithCurrency: '£69.99',
		},
		{
			paymentProductKey: 'GuardianWeeklyDomestic',
			ratePlanKey: 'Monthly',
			countryGroupId: 'GBPCountries',
			amount: 16.5,
			amountWithCurrency: '£16.5',
		},
		{
			paymentProductKey: 'GuardianWeeklyRestOfWorld',
			ratePlanKey: 'Annual',
			countryGroupId: 'International',
			amount: 432,
			amountWithCurrency: '$432',
		},
	];

	it.each(paymentProductKeys)(
		`paymentTs&Cs render Product:$paymentProductKey Period:$ratePlanKey Region:$countryGroupId Amount:$amountWithCurrency`,
		({ paymentProductKey, ratePlanKey, countryGroupId, amount }) => {
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
