import dayjs from 'dayjs';
import type {
	DirectDebitPaymentMethod,
	StripePaymentMethod,
} from '../../../model/paymentMethod';
import type { User } from '../../../model/stateSchemas';

export const today = '2025-11-11';
export const emailAddress = 'test@thegulocal.com';
export const subscriptionNumber = 'A-S123456';
export const mandateId = 'MANDATE_ID';

export const emailUser: User = {
	id: '1234',
	primaryEmailAddress: emailAddress,
	title: null,
	firstName: 'Mickey',
	lastName: 'Mouse',
	billingAddress: {
		lineOne: '90 York Way',
		city: 'London',
		state: '',
		postCode: 'N1 9GU',
		country: 'GB',
	},
	deliveryAddress: null,
	isTestUser: false,
};

export const directDebitPaymentMethod: DirectDebitPaymentMethod = {
	FirstName: emailUser.firstName,
	LastName: emailUser.lastName,
	StreetNumber: emailUser.billingAddress.lineOne,
	StreetName: emailUser.billingAddress.lineTwo ?? null,
	City: emailUser.billingAddress.city,
	PostalCode: emailUser.billingAddress.postCode,
	State: emailUser.billingAddress.state,
	Country: emailUser.billingAddress.country,
	BankTransferAccountName: `${emailUser.firstName} ${emailUser.lastName}`,
	BankCode: '20-20-20',
	Type: 'BankTransfer',
	BankTransferAccountNumber: '******11',
	BankTransferType: 'DirectDebitUK',
	PaymentGateway: 'GoCardless',
};

export const creditCardPaymentMethod: StripePaymentMethod = {
	TokenId: 'tok_1N4mX2L3a9j5f6gH7i8j9k0l',
	SecondTokenId: 'cus_J5k6l7m8n9o0p1q2r3s4t5u6',
	CreditCardNumber: '4242',
	CreditCardExpirationMonth: 12,
	CreditCardExpirationYear: 2026,
	Type: 'CreditCardReferenceTransaction' as const,
	PaymentGateway: 'Stripe PaymentIntents GNM Membership',
};

export const paymentSchedule = {
	payments: [
		{
			date: dayjs('2025-12-11').toDate(),
			amount: 10.0,
		},
		{
			date: dayjs('2026-01-11').toDate(),
			amount: 12.0,
		},
	],
};

export const fixedTermPaymentSchedule = {
	payments: [
		{
			date: dayjs('2025-12-11').toDate(),
			amount: 9,
		},
	],
};
