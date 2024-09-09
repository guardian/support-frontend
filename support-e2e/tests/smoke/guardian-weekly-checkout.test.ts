import { testGuardianWeeklyCheckout } from '../test/guardianWeeklyCheckout';

/**
 * These tests are to ensure that we can buy the different ratePlans of
 * Guardian Weekly with multiple payment types.
 */
(
	[
		{
			frequency: 'Monthly',
			paymentType: 'Credit/Debit card',
		},
		{
			frequency: 'Monthly',
			paymentType: 'Direct debit',
		},
		{
			frequency: 'Quarterly',
			paymentType: 'Credit/Debit card',
		},
		{
			frequency: 'Quarterly',
			paymentType: 'Direct debit',
		},
		{
			frequency: 'Annual',
			paymentType: 'Credit/Debit card',
		},
		{
			frequency: 'Annual',
			paymentType: 'Direct debit',
		},
	] as const
).map((testDetails) => {
	testGuardianWeeklyCheckout(testDetails);
});
