import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import type { NonDeliveryEmailFields } from './emailFields';
import { buildNonDeliveryEmailFields, formatDate } from './emailFields';

type DeliveryFields = {
	ZuoraSubscriberId: string;
	date_of_first_paper: string;
	date_of_first_payment: string;
	delivery_address_line_1: string;
	delivery_address_line_2: string;
	delivery_address_town: string;
	delivery_postcode: string;
	delivery_country: string;
};

type DeliveryEmailFields = NonDeliveryEmailFields & DeliveryFields;

export function buildDeliveryEmailFields({
	user,
	subscriptionNumber,
	currency,
	billingPeriod,
	paymentMethod,
	paymentSchedule,
	firstDeliveryDate,
	isFixedTerm,
	mandateId,
}: {
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
	firstDeliveryDate: Dayjs;
	isFixedTerm: boolean;
	mandateId?: string;
}): DeliveryEmailFields {
	const nonDeliveryFields: NonDeliveryEmailFields = buildNonDeliveryEmailFields(
		{
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
		ZuoraSubscriberId: subscriptionNumber, // This is a duplicate and will be removed in a later PR
		date_of_first_paper: formatDate(firstDeliveryDate),
		date_of_first_payment: nonDeliveryFields.first_payment_date, // This is a duplicate and will be removed in a later PR
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
