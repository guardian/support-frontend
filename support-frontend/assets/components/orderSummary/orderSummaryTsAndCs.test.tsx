import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
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
		isIntroductoryPricing: false,
	};

	type OrderSummaryTestParams = [
		ActiveProductKey,
		SupportRegionId,
		ActiveRatePlanKey,
		string | undefined,
		number,
	];

	const orderSummaryProductKeys: OrderSummaryTestParams[] = [
		['GuardianAdLite', 'uk', 'Monthly', undefined, 0],
		['Contribution', 'au', 'Annual', undefined, 0],
		['SupporterPlus', 'uk', 'Monthly', undefined, 12],
		['SupporterPlus', 'uk', 'OneYearStudent', undefined, 9],
		['GuardianWeeklyRestOfWorld', 'us', 'QuarterlyPlus', undefined, 45],
		['SubscriptionCard', 'uk', 'WeekendPlus', 'Weekend', 69.99],
		['HomeDelivery', 'uk', 'SixdayPlus', 'Six day', 83.99],
		['SubscriptionCard', 'uk', 'Sunday', 'Observer', 15.99],
		['HomeDelivery', 'uk', 'Sunday', 'Observer', 20.99],
	];
	it.each(orderSummaryProductKeys)(
		`orderSummaryTs&Cs render product %s for region %s for ratePlan %s correctly`,
		(
			paymentProductKey,
			supportRegionId,
			activeRatePlanKey,
			ratePlanDescription,
			amount,
		) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
				activeRatePlanKey === 'QuarterlyPlus' &&
				supportRegionId === 'us'
					? promotionWeeklyDigitalUnitedStatesQuarterly
					: undefined;
			const { container } = render(
				<OrderSummaryTsAndCs
					productKey={paymentProductKey}
					ratePlanKey={activeRatePlanKey}
					ratePlanDescription={ratePlanDescription}
					supportRegionId={supportRegionId}
					thresholdAmount={amount}
					promotion={promo}
				/>,
			);
			expect(container.textContent).toMatchSnapshot();
		},
	);
});
