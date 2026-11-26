import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { OrderSummaryTsAndCsDmcca } from './orderSummmaryTsAndCsDmcc';

// Mock a specific date and including copy that contains delivery date
const mockDate = new Date('2026-11-25');
const mockWeeklyCopy =
	'Your first issue of Guardian Weekly will be Friday, December 4, 2026. Please allow 1 to 7 days after your start date for your magazine to arrive, depending on national post services.Your digital benefits will start today.';
const mockSubscriptionCopy =
	'Your physical subscription card will be delivered to your door by Saturday, December 5, 2026, for you to collect in store the first newspaper edition you are entitled to in your weekend subscription.Your digital benefits will start today.';
const mockDeliveryCopy =
	'You will receive your first newspaper delivery on Saturday, November 28, 2026 as part of your six day subscription.Your digital benefits will start today.';
const mockObserverSubscriptionCopy =
	'Your physical subscription card will be delivered to your door by Sunday, December 6, 2026, for you to collect in store the first newspaper edition you are entitled to in your Observer subscription.Your digital benefits will start today.';
const mockObserverDeliveryCopy =
	'You will receive your first newspaper delivery on Sunday, November 29, 2026 as part of your Observer subscription.Your digital benefits will start today.';
const mockWeeklyGiftCopy =
	'Your Guardian Weekly gift subscription will start on Wednesday, November 25, 2026. The recipient should receive their first magazine 1 - 7 days after this issue date, depending on national post services.';
beforeAll(() => {
	jest.useFakeTimers().setSystemTime(mockDate);
});
afterAll(() => {
	jest.useRealTimers();
});

const expectSummaryTsAndCs = (
	summaryTsAndCs: JSX.Element | null,
	copy?: string,
) => {
	const { container } = render(summaryTsAndCs);
	if (copy === undefined) {
		expect(container.firstChild).toBeNull();
		return;
	}
	expect(container.textContent).toMatchSnapshot();
	expect(container.textContent).toBe(copy);
};

describe('orderSummaryTs&Cs Dmcc Snapshot comparison', () => {
	type OrderSummaryTestParams = [
		ActiveProductKey,
		ActiveRatePlanKey,
		string | undefined,
		Date | undefined,
		string | undefined,
	];

	const orderSummaryProductKeys: OrderSummaryTestParams[] = [
		['SupporterPlus', 'Monthly', undefined, undefined, undefined],
		['DigitalSubscription', 'Annual', undefined, undefined, undefined],
		[
			'GuardianWeeklyDomestic',
			'MonthlyPlus',
			undefined,
			undefined,
			mockWeeklyCopy,
		],
		[
			'GuardianWeeklyDomestic',
			'QuarterlyPlus',
			undefined,
			undefined,
			mockWeeklyCopy,
		],
		[
			'GuardianWeeklyDomestic',
			'AnnualPlus',
			undefined,
			undefined,
			mockWeeklyCopy,
		],
		[
			'GuardianWeeklyDomestic',
			'ThreeMonthGift',
			undefined,
			undefined,
			'', // no gift delivery date set
		],
		[
			'GuardianWeeklyDomestic',
			'ThreeMonthGift',
			undefined,
			mockDate,
			mockWeeklyGiftCopy,
		],
		[
			'SubscriptionCard',
			'WeekendPlus',
			'weekend',
			undefined,
			mockSubscriptionCopy,
		],
		[
			'SubscriptionCard',
			'Sunday',
			'Observer',
			undefined,
			mockObserverSubscriptionCopy,
		],
		['HomeDelivery', 'SixdayPlus', 'six day', undefined, mockDeliveryCopy],
		['HomeDelivery', 'Sunday', 'Observer', undefined, mockObserverDeliveryCopy],
	];
	it.each(orderSummaryProductKeys)(
		`dmcca orderSummaryTs&Cs render product:%s/ratePlan:%s correctly (%s)`,
		(
			paymentProductKey,
			activeRatePlanKey,
			ratePlanDescription,
			weeklyDeliveryDate,
			copy,
		) => {
			expectSummaryTsAndCs(
				<OrderSummaryTsAndCsDmcca
					productKey={paymentProductKey}
					ratePlanKey={activeRatePlanKey}
					ratePlanDescription={ratePlanDescription}
					weeklyGiftDeliveryDate={weeklyDeliveryDate}
				/>,
				copy,
			);
		},
	);
});
