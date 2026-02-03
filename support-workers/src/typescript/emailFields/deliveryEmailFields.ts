import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import type { NonDeliveryEmailFields } from './emailFields';
import { buildNonDeliveryEmailFields } from './emailFields';

type DeliveryFields = {
	delivery_address_line_1: string;
	delivery_address_line_2: string;
	delivery_address_town: string;
	delivery_postcode: string;
	delivery_country: string;
};

type DeliveryEmailFields = NonDeliveryEmailFields & DeliveryFields;

export function buildDeliveryEmailFields({
	today,
	user,
	subscriptionNumber,
	currency,
	billingPeriod,
	paymentMethod,
	paymentSchedule,
	isFixedTerm,
	mandateId,
}: {
	today: Dayjs;
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
	isFixedTerm: boolean;
	mandateId?: string;
}): DeliveryEmailFields {
	const nonDeliveryFields: NonDeliveryEmailFields = buildNonDeliveryEmailFields(
		{
			today: today,
			user: user,
			subscriptionNumber: subscriptionNumber,
			currency: currency,
			billingPeriod: billingPeriod,
			paymentMethod: paymentMethod,
			paymentSchedule: paymentSchedule,
			isFixedTerm: isFixedTerm,
			mandateId: mandateId,
		},
	);

	const address = user.deliveryAddress ?? user.billingAddress;
	const deliveryFields = {
		delivery_address_line_1: address.lineOne ?? '',
		delivery_address_line_2: address.lineTwo ?? '',
		delivery_address_town: address.city ?? '',
		delivery_postcode: address.postCode ?? '',
		delivery_country: getCountryNameByIsoCode(address.country) ?? '',
	};

	return {
		...nonDeliveryFields,
		...deliveryFields,
	};
}
