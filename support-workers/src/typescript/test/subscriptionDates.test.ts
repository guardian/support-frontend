import dayjs from 'dayjs';
import type {
	ContributionState,
	DigitalSubscriptionState,
	GuardianWeeklyState,
	PaperState,
	TierThreeState,
} from '../model/createZuoraSubscriptionState';
import { getSubscriptionDates } from '../util/subscriptionDates';

describe('getSubscriptionDates', () => {
	const now = dayjs('2024-06-01T12:00:00Z');

	it('should set customerAcceptanceDate to firstDeliveryDate for GuardianWeekly', () => {
		const productSpecificState = {
			productType: 'GuardianWeekly',
			firstDeliveryDate: '2024-06-10',
		} as GuardianWeeklyState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toBe(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toBe(
			'2024-06-10',
		);
	});

	it('should set customerAcceptanceDate to firstDeliveryDate for TierThree', () => {
		const productSpecificState = {
			productType: 'TierThree',
			firstDeliveryDate: '2024-06-15',
		} as TierThreeState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toBe(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toBe(
			'2024-06-15',
		);
	});

	it('should set customerAcceptanceDate to firstDeliveryDate for Paper', () => {
		const productSpecificState = {
			productType: 'Paper',
			firstDeliveryDate: '2024-06-20',
		} as PaperState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toBe(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toBe(
			'2024-06-20',
		);
	});

	it('should set customerAcceptanceDate to now + 16 days for DigitalSubscription', () => {
		const productSpecificState = {
			productType: 'DigitalSubscription',
		} as DigitalSubscriptionState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toBe(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toBe(
			now.add(16, 'day').format('YYYY-MM-DD'),
		);
	});

	it('should set customerAcceptanceDate to now for other product types', () => {
		const productSpecificState = {
			productType: 'Contribution',
		} as ContributionState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toBe(now);
		expect(result.customerAcceptanceDate).toBe(now);
	});
});
