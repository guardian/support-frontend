import { combinedAddressLine } from '../model/address';
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
import { ServiceHandler } from '../services/config';
import { getPayPalConfig, PayPalService } from '../services/payPal';
import { getStripeConfig, StripeService } from '../services/stripe';
import { Lazy } from '../util/lazy';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = process.env.stage as Stage;
const stripeServiceHandler = new ServiceHandler(stage, async (stage) => {
	const config = await getStripeConfig(stage);
	return new StripeService(config);
});
const lazyPayPalService = new Lazy(async () => {
	const config = await getPayPalConfig(stage);
	return new PayPalService(config);
}, 'PayPalConfig');

export const handler = async (
	state: CreatePaymentMethodState,
): Promise<CreateSalesforceContactState> => {
	console.log(`Input is ${JSON.stringify(state)}`);
	return createSalesforceContactState(
		state,
		await createPaymentMethod(
			state.paymentFields,
			state.user,
			state.ipAddress,
			state.userAgent,
		),
	);
};

export function createPaymentMethod(
	paymentFields: PaymentFields,
	user: User,
	ipAddress: string,
	userAgent: string,
): Promise<PaymentMethod> {
	switch (paymentFields.paymentType) {
		case 'Stripe':
			return createStripePaymentMethod(user.isTestUser, paymentFields);
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

export function createSalesforceContactState(
	state: CreatePaymentMethodState,
	paymentMethod: PaymentMethod,
): CreateSalesforceContactState {
	return {
		...state,
		paymentMethod,
	};
}

export async function createStripePaymentMethod(
	isTestUser: boolean,
	paymentFields: StripePaymentFields,
): Promise<StripePaymentMethod> {
	const stripeService = await stripeServiceHandler.getServiceForUser(
		isTestUser,
	);
	const customer = await stripeService.createCustomer(
		paymentFields.stripePublicKey,
		paymentFields.paymentMethod,
	);
	const paymentMethod = await stripeService.getPaymentMethod(
		paymentFields.stripePublicKey,
		paymentFields.paymentMethod,
	);
	const card = getIfDefined(
		paymentMethod.card,
		`Couldn't retrieve card details from Stripe for customer ${customer.id}`,
	);
	return {
		TokenId: paymentFields.paymentMethod,
		SecondTokenId: customer.id,
		CreditCardNumber: card.last4,
		CreditCardCountry: card.country,
		CreditCardExpirationMonth: card.exp_month,
		CreditCardExpirationYear: card.exp_year,
		CreditCardType: card.brand,
		PaymentGateway: stripeService.getPaymentGateway(
			paymentFields.stripePublicKey,
		),
		Type: 'CreditCardReferenceTransaction',
		StripePaymentType: paymentFields.stripePaymentType,
	};
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
