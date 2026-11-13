import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
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
	const promotionGuardianWeeklyUnitedStatesAnnual: PromoWithCatalogInformation =
		{
			name: '25% off for 12 months',
			description: 'Guardian Weekly Digital United States Annual',
			promoCode: 'ANNUAL25',
			campaignCode: 'TEST_CAMPAIGN',
			appliesTo: {
				productRatePlanIds: [],
				countries: ['US'],
				catalogRatePlans: [],
			},
			startTimestamp: '2025-01-01T00:00:00.000Z',
			endTimestamp: '2026-01-01T00:00:00.000Z',
			discount: { amount: 25, durationMonths: 12 },
			isIntroductoryPricing: false,
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
			ratePlanKey: 'MonthlyPlus',
			countryGroupId: 'GBPCountries',
			amount: 16.5,
			amountWithCurrency: '£16.5',
		},
		{
			paymentProductKey: 'GuardianWeeklyRestOfWorld',
			ratePlanKey: 'AnnualPlus',
			countryGroupId: 'International',
			amount: 432,
			amountWithCurrency: '$432',
		},
	];

	it.each(paymentProductKeys)(
		`paymentTs&Cs render Product:$paymentProductKey Period:$ratePlanKey Region:$countryGroupId Amount:$amountWithCurrency`,
		({ paymentProductKey, ratePlanKey, countryGroupId, amount }) => {
			const promo: PromoWithCatalogInformation | undefined =
				paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
				ratePlanKey === 'AnnualPlus' &&
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
