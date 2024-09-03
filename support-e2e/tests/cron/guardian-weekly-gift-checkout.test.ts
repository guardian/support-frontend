import { testGuardianWeeklyGiftCheckout } from '../test/guardianWeeklyGiftCheckout';

/**
 * These tests are to ensure that we can buy the different ratePlans of
 * Guardian Weekly as a gift with multiple payment types.
 *
 * This is only PayPal as we try to avoid "To many login attempts" and
 * other rate limiting errors.
 */
(
	[
		{
			frequency: '3 months',
			paymentType: 'PayPal',
		},
	] as const
).map((testDetails) => {
	testGuardianWeeklyGiftCheckout(testDetails);
});
