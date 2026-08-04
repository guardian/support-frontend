import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { render } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { PaymentTsAndCs } from './paymentTsAndCs';

// Mocking product deliveryDate
jest.mock('pages/[supportRegionId]/checkout/helpers/deliveryDays', () => ({
	getProductFirstDeliveryDate: () => 'Sunday, September 21, 2025',
}));

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};

describe('Payment Ts&Cs Snapshot comparison', () => {
	const promotionGuardianWeeklyUnitedStatesAnnual: Promotion = {
		name: '10% off for 12 months',
		description: 'Guardian Weekly Digital United States Annual',
		promoCode: 'ANNUAL10',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 324,
		isIntroductoryPricing: false,
	};

	type PaymentProductTestParams = {
		paymentProductKey: ActiveProductKey;
		ratePlanKey: ActiveRatePlanKey;
		supportRegionId: SupportRegionId;
		amount: number;
		amountWithCurrency: string;
	};

	const paymentProductKeys: PaymentProductTestParams[] = [
		{
			paymentProductKey: 'GuardianAdLite',
			ratePlanKey: 'Monthly',
			supportRegionId: 'uk',
			amount: 5,
			amountWithCurrency: '£5',
		},
		{
			paymentProductKey: 'DigitalSubscription',
			ratePlanKey: 'Monthly',
			supportRegionId: 'uk',
			amount: 18,
			amountWithCurrency: '£18',
		},
		{
			paymentProductKey: 'DigitalSubscription',
			ratePlanKey: 'Monthly',
			supportRegionId: 'us',
			amount: 28,
			amountWithCurrency: '$28',
		},
		{
			paymentProductKey: 'Contribution',
			ratePlanKey: 'Annual',
			supportRegionId: 'au',
			amount: 100,
			amountWithCurrency: '$100',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			supportRegionId: 'uk',
			amount: 12,
			amountWithCurrency: '£12',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			supportRegionId: 'us',
			amount: 15,
			amountWithCurrency: '$15',
		},
		{
			paymentProductKey: 'SupporterPlus',
			ratePlanKey: 'OneYearStudent',
			supportRegionId: 'uk',
			amount: 9,
			amountWithCurrency: '£9',
		},
		{
			paymentProductKey: 'HomeDelivery',
			ratePlanKey: 'EverydayPlus',
			supportRegionId: 'uk',
			amount: 83.99,
			amountWithCurrency: '£83.99',
		},
		{
			paymentProductKey: 'NationalDelivery',
			ratePlanKey: 'EverydayPlus',
			supportRegionId: 'uk',
			amount: 83.99,
			amountWithCurrency: '£83.99',
		},
		{
			paymentProductKey: 'SubscriptionCard',
			ratePlanKey: 'EverydayPlus',
			supportRegionId: 'uk',
			amount: 69.99,
			amountWithCurrency: '£69.99',
		},
		{
			paymentProductKey: 'GuardianWeeklyDomestic',
			ratePlanKey: 'MonthlyPlus',
			supportRegionId: 'uk',
			amount: 16.5,
			amountWithCurrency: '£16.5',
		},
		{
			paymentProductKey: 'GuardianWeeklyRestOfWorld',
			ratePlanKey: 'AnnualPlus',
			supportRegionId: 'int',
			amount: 432,
			amountWithCurrency: '$432',
		},
	];

	it.each(paymentProductKeys)(
		`paymentTs&Cs render Product:$paymentProductKey Period:$ratePlanKey Region:$supportRegionId Amount:$amountWithCurrency`,
		({ paymentProductKey, ratePlanKey, supportRegionId, amount }) => {
			const promo: Promotion | undefined =
				paymentProductKey === 'GuardianWeeklyRestOfWorld' &&
				ratePlanKey === 'AnnualPlus' &&
				supportRegionId === 'us'
					? promotionGuardianWeeklyUnitedStatesAnnual
					: undefined;
			const { container } = render(
				<PaymentTsAndCs
					productKey={paymentProductKey}
					ratePlanKey={ratePlanKey}
					supportRegionId={supportRegionId}
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
