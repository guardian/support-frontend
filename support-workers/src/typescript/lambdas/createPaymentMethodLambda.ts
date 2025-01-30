import { combinedAddressLine } from '../model/address';
import type {
	DirectDebitPaymentFields,
	PaymentFields,
	PayPalPaymentFields,
	StripePaymentFields,
} from '../model/paymentFields';
import type {
	DirectDebitPaymentMethod,
	PaymentMethod,
	PayPalPaymentMethod,
	StripePaymentMethod,
} from '../model/paymentMethod';
import { stageFromEnvironment } from '../model/stage';
import type {
	CreatePaymentMethodState,
	CreateSalesforceContactState,
	User,
	WrappedState,
} from '../model/stateSchemas';
import {
	createPaymentMethodStateSchema,
	wrapperSchemaForState,
} from '../model/stateSchemas';
import { ServiceHandler } from '../services/config';
import { getPayPalConfig, PayPalService } from '../services/payPal';
import { getStripeConfig, StripeService } from '../services/stripe';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();
const stripeServiceHandler = new ServiceHandler(stage, async (stage) => {
	const config = await getStripeConfig(stage);
	return new StripeService(config);
});
const paypalServiceHandler = new ServiceHandler(stage, async (stage) => {
	const config = await getPayPalConfig(stage);
	return new PayPalService(config);
});

export const handler = async (
	state: WrappedState<CreatePaymentMethodState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);
	const createPaymentMethodState = wrapperSchemaForState(
		createPaymentMethodStateSchema,
	).parse(state).state;
	return createSalesforceContactState(
		createPaymentMethodState,
		await createPaymentMethod(
			createPaymentMethodState.paymentFields,
			createPaymentMethodState.user,
		),
	);
};

export function createPaymentMethod(
	paymentFields: PaymentFields,
	user: User,
): Promise<PaymentMethod> {
	switch (paymentFields.paymentType) {
		case 'Stripe':
			return createStripePaymentMethod(user.isTestUser, paymentFields);
		case 'PayPal':
			return createPayPalPaymentMethod(user.isTestUser, paymentFields);
		case 'DirectDebit':
			return createDirectDebitPaymentMethod(paymentFields, user);
		case 'Existing':
			return Promise.reject(
				new Error(
					'Existing payment methods should never make their way to this lambda',
				),
			);
	}
	return Promise.reject(new Error('Unknown payment method type'));
}

export function createSalesforceContactState(
	inputState: CreatePaymentMethodState,
	paymentMethod: PaymentMethod,
): WrappedState<CreateSalesforceContactState> {
	const outputState: CreateSalesforceContactState = {
		...inputState,
		paymentMethod,
	};

	return {
		state: outputState,
		error: null,
		requestInfo: {
			testUser: false,
			failed: false,
			messages: [],
			accountExists: false,
		},
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
	isTestUser: boolean,
	payPal: PayPalPaymentFields,
): Promise<PayPalPaymentMethod> {
	const payPalService = await paypalServiceHandler.getServiceForUser(
		isTestUser,
	);
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
