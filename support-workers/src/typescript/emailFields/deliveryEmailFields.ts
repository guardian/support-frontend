import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { User } from '../model/stateSchemas';
import type { EmailPaymentFields } from './emailFields';
import { formatDate, getPaymentFields } from './emailFields';

type BasicFields = {
	ZuoraSubscriberId: string;
	subscriber_id: string;
	first_name: string;
	last_name: string;
	date_of_first_paper: string;
	date_of_first_payment: string;
	subscription_rate: string;
};

type AddressFields = {
	delivery_address_line_1: string;
	delivery_address_line_2: string;
	delivery_address_town: string;
	delivery_postcode: string;
	delivery_country: string;
};

type DeliveryEmailFields = BasicFields & AddressFields & EmailPaymentFields;

export function buildDeliveryEmailFields({
	subscriptionNumber,
	user,
	firstDeliveryDate,
	firstPaymentDate,
	paymentDescription,
	paymentMethod,
	mandateId,
}: {
	subscriptionNumber: string;
	user: User;
	firstDeliveryDate: Dayjs;
	firstPaymentDate: Dayjs;
	paymentDescription: string;
	paymentMethod: PaymentMethod;
	mandateId?: string;
}): DeliveryEmailFields {
	const basicFields = {
		ZuoraSubscriberId: subscriptionNumber,
		subscriber_id: subscriptionNumber,
		first_name: user.firstName,
		last_name: user.lastName,
		date_of_first_paper: formatDate(firstDeliveryDate),
		date_of_first_payment: formatDate(firstPaymentDate),
		subscription_rate: paymentDescription,
	};
	const address = user.deliveryAddress ?? user.billingAddress;
	const addressFields = {
		delivery_address_line_1: address.lineOne ?? '',
		delivery_address_line_2: address.lineTwo ?? '',
		delivery_address_town: address.city ?? '',
		delivery_postcode: address.postCode ?? '',
		delivery_country: getCountryNameByIsoCode(address.country) ?? '',
	};

	const paymentFields = getPaymentFields(paymentMethod, mandateId);

	return {
		...basicFields,
		...addressFields,
		...paymentFields,
	};
}
