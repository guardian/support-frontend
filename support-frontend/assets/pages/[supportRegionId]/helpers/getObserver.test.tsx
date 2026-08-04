import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import getObserver from './getObserver';

describe('getObserver', () => {
	it('returns undefined when ratePlanKey is not "Sunday"', () => {
		const result = getObserver('HomeDelivery', 'Everyday');
		expect(result).toBeUndefined();
	});

	it('returns ObserverPrint.Paper when ratePlanKey is "Sunday" and productKey is HomeDelivery', () => {
		const result = getObserver('HomeDelivery', 'Sunday');
		expect(result).toBe(ObserverPrint.Paper);
	});

	it('returns ObserverPrint.Paper when ratePlanKey is "Sunday" and productKey is NationalDelivery', () => {
		const result = getObserver('NationalDelivery', 'Sunday');
		expect(result).toBe(ObserverPrint.Paper);
	});

	it('returns ObserverPrint.SubscriptionCard when ratePlanKey is "Sunday" and productKey is SubscriptionCard', () => {
		const result = getObserver('SubscriptionCard', 'Sunday');
		expect(result).toBe(ObserverPrint.SubscriptionCard);
	});

	it('returns undefined for unknown product keys even if ratePlanKey is "Sunday"', () => {
		const result = getObserver('SupporterPlus', 'Sunday');
		expect(result).toBeUndefined();
	});
});
