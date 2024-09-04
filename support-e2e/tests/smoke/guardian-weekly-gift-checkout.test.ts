import { testGuardianWeeklyGiftCheckout } from '../test/guardianWeeklyGiftCheckout';

/**
 * These tests are to ensure that we can buy the different ratePlans of
 * Guardian Weekly as a gift with multiple payment types.
 */
(
	[
		{
			frequency: '3 months',
			paymentType: 'Credit/Debit card',
		},
		{
			frequency: '3 months',
			paymentType: 'Direct debit',
		},
		{
			frequency: '12 months',
			paymentType: 'Credit/Debit card',
		},
		{
			frequency: '12 months',
			paymentType: 'Direct debit',
		},
	] as const
).map((testDetails) => {
	testGuardianWeeklyGiftCheckout(testDetails);
});
