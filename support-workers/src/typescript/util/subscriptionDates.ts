import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ProductSpecificState } from '../model/createZuoraSubscriptionState';

const freeTrialPeriodInDays = 14;
const paymentGracePeriodInDays = 2;

export const getSubscriptionDates = <T extends ProductSpecificState>(
	now: Dayjs,
	productSpecificState: T,
): {
	contractEffectiveDate: Dayjs;
	customerAcceptanceDate: Dayjs;
} => {
	return {
		contractEffectiveDate: now,
		customerAcceptanceDate: getCustomerAcceptanceDate(
			now,
			productSpecificState,
		),
	};
};

const getCustomerAcceptanceDate = <T extends ProductSpecificState>(
	now: Dayjs,
	productSpecificState: T,
): Dayjs => {
	if (
		productSpecificState.productType === 'GuardianWeekly' ||
		productSpecificState.productType === 'TierThree' ||
		productSpecificState.productType === 'Paper'
	) {
		return dayjs(productSpecificState.firstDeliveryDate);
	} else if (productSpecificState.productType === 'DigitalSubscription') {
		return now.add(freeTrialPeriodInDays + paymentGracePeriodInDays, 'day');
	}
	return now;
};
