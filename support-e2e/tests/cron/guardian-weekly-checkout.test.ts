import { testGuardianWeeklyCheckout } from '../test/guardianWeeklyCheckout';

/**
 * These tests are to ensure that we can buy the different ratePlans of
 * Guardian Weekly with multiple payment types.
 *
 * This is only PayPal as we try to avoid "To many login attempts" and
 * other rate limiting errors.
 */
(
	[
		{
			frequency: 'Monthly',
			paymentType: 'PayPal',
		},
	] as const
).map((testDetails) => {
	testGuardianWeeklyCheckout(testDetails);
});
