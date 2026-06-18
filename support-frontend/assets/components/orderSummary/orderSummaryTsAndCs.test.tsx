import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { OrderSummaryTsAndCs } from './orderSummaryTsAndCs';

// Mock the date - some of the Ts&Cs include calculated dates
beforeAll(() => {
	jest.useFakeTimers().setSystemTime(new Date('2025-08-29'));
});

afterAll(() => {
	jest.useRealTimers();
});

describe('orderSummaryTs&Cs Snapshot comparison', () => {
	const promotionWeeklyDigitalUnitedStatesQuarterly: Promotion = {
		name: '50% off for 3 months',
		description: 'Guardian Weekly United States Quarterly',
		promoCode: 'GUARDIAN_WEEKLY_DIGITAL_USA_QUARTERLY',
		numberOfDiscountedPeriods: 3,
		discountedPrice: 54,
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
			const promo: Promotion | undefined =
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
