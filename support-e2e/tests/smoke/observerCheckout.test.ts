import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testObserverCheckout } from '../test/observerCheckout';

afterEachTasks(test);

test.describe('Observer Checkout', () => {
	[
		{
			product: 'HomeDelivery',
			ratePlan: 'Sunday',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'SubscriptionCard',
			ratePlan: 'Sunday',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
	].forEach((testDetails) => {
		testObserverCheckout(testDetails);
	});
});
