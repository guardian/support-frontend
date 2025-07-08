import test from '@playwright/test';
import { testAdLiteCheckout } from '../test/adLiteCheckout';
import type { TestDetails } from '../test/adLiteCheckout';

const tests: TestDetails[] = [
	{
		paymentType: 'Credit/Debit card',
		ratePlan: 'Monthly',
	},
];

test.describe('Ad Lite Checkout', () =>
	tests.map((testDetails) => testAdLiteCheckout(testDetails)));
