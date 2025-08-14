import dayjs from 'dayjs';
import type {
	ContributionState,
	DigitalSubscriptionState,
	GuardianWeeklyState,
	PaperState,
	ProductSpecificState,
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
		expect(result.contractEffectiveDate).toEqual(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toEqual(
			'2024-06-10',
		);
	});

	it('should set customerAcceptanceDate to firstDeliveryDate for TierThree', () => {
		const productSpecificState = {
			productType: 'TierThree',
			firstDeliveryDate: '2024-06-15',
		} as TierThreeState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toEqual(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toEqual(
			'2024-06-15',
		);
	});

	it('should set customerAcceptanceDate to firstDeliveryDate for Paper', () => {
		const productSpecificState = {
			productType: 'Paper',
			firstDeliveryDate: '2024-06-20',
		} as PaperState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toEqual(now);
		expect(result.customerAcceptanceDate.format('YYYY-MM-DD')).toEqual(
			'2024-06-20',
		);
	});

	it('should set customerAcceptanceDate to now + 16 days for DigitalSubscription', () => {
		const productSpecificState = {
			productType: 'DigitalSubscription',
		} as DigitalSubscriptionState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toEqual(now);
		expect(result.customerAcceptanceDate).toEqual(now.add(16, 'day'));
	});

	it('should set customerAcceptanceDate to now + 15 days for GuardianAdLite', () => {
		const productSpecificState = {
			productType: 'GuardianAdLite',
		} as ProductSpecificState;
		const result = getSubscriptionDates(now, productSpecificState);
		expect(result.contractEffectiveDate).toEqual(now);
		expect(result.customerAcceptanceDate).toEqual(now.add(15, 'day'));
	});

	it('should set customerAcceptanceDate to now for other product types', () => {
		const productTypes = ['SupporterPlus', 'Contribution'];
		productTypes.forEach((productType) => {
			console.log(`Testing product type: ${productType}`);
			const productSpecificState = {
				productType,
			} as ContributionState; // Using ContributionState as a fallback type
			const result = getSubscriptionDates(now, productSpecificState);
			expect(result.contractEffectiveDate).toEqual(now);
			expect(result.customerAcceptanceDate).toEqual(now);
		});
	});
});
