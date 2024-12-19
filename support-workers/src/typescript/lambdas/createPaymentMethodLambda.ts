import { combinedAddressLine } from '../model/address';
import type { Currency } from '../model/currency';
import type {
	DirectDebitPaymentFields,
	PaymentFields,
	PayPalPaymentFields,
	SepaPaymentFields,
	StripePaymentFields,
} from '../model/paymentFields';
import type {
	DirectDebitPaymentMethod,
	PaymentMethod,
	PayPalPaymentMethod,
	SepaPaymentMethod,
	StripePaymentMethod,
} from '../model/paymentMethod';
import type { Stage } from '../model/stage';
import type {
	CreatePaymentMethodState,
	CreateSalesforceContactState,
	User,
} from '../model/stateSchemas';
import { getPayPalConfig, PayPalService } from '../services/payPal';
import { Lazy } from '../util/lazy';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = process.env.stage as Stage;
const lazyPayPalService = new Lazy(async () => {
	const config = await getPayPalConfig(stage);
	return new PayPalService(config);
}, 'PayPalConfig');

export const handler = async (
	state: CreatePaymentMethodState,
): Promise<CreateSalesforceContactState> => {
	console.log(`Input is ${JSON.stringify(state)}`);
	return Promise.resolve({
		...state,
		paymentMethod: {
			Type: 'PayPal',
			PaypalBaid: '123',
			PaypalEmail: 'test@test.com',
			PaypalType: 'ExpressCheckout',
			PaymentGateway: 'PayPal Express',
		},
	});
};

export function createPaymentMethod(
	paymentFields: PaymentFields,
	user: User,
	currency: Currency,
	ipAddress: string,
	userAgent: string,
): Promise<PaymentMethod> {
	switch (paymentFields.paymentType) {
		case 'Stripe':
			return createStripePaymentMethod(paymentFields, currency);
		case 'PayPal':
			return createPayPalPaymentMethod(paymentFields);
		case 'DirectDebit':
			return createDirectDebitPaymentMethod(paymentFields, user);
		case 'Sepa':
			return createSepaPaymentMethod(paymentFields, user, ipAddress, userAgent);
		case 'Existing':
			return Promise.reject(
				new Error(
					'Existing payment methods should never make their way to this lambda',
				),
			);
		default:
			return Promise.reject(new Error('Unknown payment method type'));
	}
}

export function getCreateSalesforceContactState(
	state: CreatePaymentMethodState,
	paymentMethod: PaymentMethod,
): CreateSalesforceContactState {
	return {
		...state,
		paymentMethod,
	};
}

export function createStripePaymentMethod(
	stripe: StripePaymentFields,
	currency: Currency,
): Promise<StripePaymentMethod> {
	// const stripeServiceForCurrency = stripe.stripePublicKey
	// 	? stripeService.withPublicKey(stripe.stripePublicKey)
	// 	: stripeService.withCurrency(currency);
	//
	// return stripeServiceForCurrency
	// 	.createCustomerFromPaymentMethod(stripe.paymentMethod)
	// 	.then((stripeCustomer) =>
	// 		stripeServiceForCurrency
	// 			.getPaymentMethod(stripe.paymentMethod)
	// 			.then((stripePaymentMethod) => {
	// 				const card = stripePaymentMethod.card;
	// 				return {
	// 					paymentMethodId: stripe.paymentMethod.value,
	// 					customerId: stripeCustomer.id,
	// 					last4: card.last4,
	// 					country: CountryGroup.countryByCode(card.country),
	// 					expMonth: card.exp_month,
	// 					expYear: card.exp_year,
	// 					cardType: card.brand.zuoraCreditCardType,
	// 					paymentGateway: stripeServiceForCurrency.paymentIntentGateway,
	// 					stripePaymentType: stripe.stripePaymentType,
	// 				};
	// 			}),
	// 	);
}

async function createPayPalPaymentMethod(
	payPal: PayPalPaymentFields,
): Promise<PayPalPaymentMethod> {
	const payPalService = await lazyPayPalService.get();
	const email = await payPalService.retrieveEmail(payPal.baid);
	return {
		PaypalBaid: payPal.baid,
		PaypalEmail: getIfDefined(email, 'Could not retrieve email from PayPal'),
		PaypalType: 'ExpressCheckout',
		Type: 'PayPal',
		PaymentGateway: 'PayPal Express',
	};
}

export function createDirectDebitPaymentMethod(
	dd: DirectDebitPaymentFields,
	user: User,
): Promise<DirectDebitPaymentMethod> {
	const addressLine = combinedAddressLine(
		user.billingAddress.lineOne,
		user.billingAddress.lineTwo,
	);

	return Promise.resolve({
		Type: 'BankTransfer',
		PaymentGateway: 'GoCardless',
		BankTransferType: 'DirectDebitUK',
		FirstName: user.firstName,
		LastName: user.lastName,
		BankTransferAccountName: dd.accountHolderName,
		BankCode: dd.sortCode,
		BankTransferAccountNumber: dd.accountNumber,
		Country: user.billingAddress.country,
		City: user.billingAddress.city,
		PostalCode: user.billingAddress.postCode,
		State: user.billingAddress.state,
		StreetName: addressLine?.streetName ?? null,
		StreetNumber: addressLine?.streetNumber ?? null,
	});
}

export function createSepaPaymentMethod(
	sepa: SepaPaymentFields,
	user: User,
	ipAddress: string,
	userAgent: string,
): Promise<SepaPaymentMethod> {
	if (ipAddress.length > 15) {
		console.warn(`IPv6 Address: ${ipAddress} is longer than 15 characters`);
	}
	if (userAgent.length > 255) {
		console.warn(
			`User Agent: ${userAgent} will be truncated to 255 characters`,
		);
	}
	return Promise.resolve({
		Type: 'BankTransfer',
		BankTransferType: 'SEPA',
		BankTransferAccountName: sepa.accountHolderName,
		BankTransferAccountNumber: sepa.iban,
		Country: sepa.country,
		StreetName: sepa.streetName,
		Email: user.primaryEmailAddress,
		IPAddress: ipAddress.slice(0, 15),
		PaymentGateway: 'Stripe Bank Transfer - GNM Membership',
		GatewayOptionData: {
			GatewayOption: [
				{
					name: 'UserAgent',
					value: userAgent.slice(0, 255),
				},
			],
		},
	});
}
