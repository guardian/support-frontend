import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

// Mock the date - some of the Ts&Cs include calculated dates
beforeAll(() => {
	jest.useFakeTimers().setSystemTime(new Date('2025-08-29'));
});

afterAll(() => {
	jest.useRealTimers();
});

describe('orderSummaryTs&Cs Snapshot comparison', () => {
	const promotionWeeklyDigitalUnitedStatesQuarterly: PromoWithCatalogInformation =
		{
			name: '20% off for 9 months',
			description: 'Guardian Weekly United States Quarterly',
			promoCode: 'GUARDIAN_WEEKLY_DIGITAL_USA_QUARTERLY',
			campaignCode: 'TEST_CAMPAIGN',
			appliesTo: {
				productRatePlanIds: [],
				countries: ['US'],
				catalogRatePlans: [],
			},
			startTimestamp: '2025-01-01T00:00:00.000Z',
			endTimestamp: '2026-01-01T00:00:00.000Z',
			discount: { amount: 20, durationMonths: 9 },
			isIntroductoryPricing: false,
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
		[
			'GuardianWeeklyRestOfWorld',
			'UnitedStates',
			'QuarterlyPlus',
			undefined,
			45,
		],
		['SubscriptionCard', 'GBPCountries', 'WeekendPlus', 'Weekend', 69.99],
		['HomeDelivery', 'GBPCountries', 'SixdayPlus', 'Six day', 83.99],
		['SubscriptionCard', 'GBPCountries', 'Sunday', 'Observer', 15.99],
		['HomeDelivery', 'GBPCountries', 'Sunday', 'Observer', 20.99],
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
			const promo: PromoWithCatalogInformation | undefined =
				paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
				activeRatePlanKey === 'QuarterlyPlus' &&
				countryGroupId === 'UnitedStates'
					? promotionWeeklyDigitalUnitedStatesQuarterly
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
