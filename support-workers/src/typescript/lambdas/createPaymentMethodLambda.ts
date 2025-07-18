import { combinedAddressLine } from '../model/address';
import type {
	DirectDebitPaymentFields,
	PaymentFields,
	PayPalPaymentFields,
	StripeHostedPaymentFields,
	StripePaymentFields,
} from '../model/paymentFields';
import {
	guardianDirectDebitGateway,
	tortoiseMediaDirectDebitGateway,
} from '../model/paymentGateway';
import type {
	DirectDebitPaymentMethod,
	PaymentMethod,
	PayPalPaymentMethod,
	StripePaymentMethod,
} from '../model/paymentMethod';
import type { ProductType } from '../model/productType';
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
import { ServiceProvider } from '../services/config';
import { getPayPalConfig, PayPalService } from '../services/payPal';
import { getStripeConfig, StripeService } from '../services/stripe';
import { asRetryError } from '../util/errorHandler';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();
const stripeServiceProvider = new ServiceProvider(stage, async (stage) => {
	const config = await getStripeConfig(stage);
	return new StripeService(config);
});
const paypalServiceProvider = new ServiceProvider(stage, async (stage) => {
	const config = await getPayPalConfig(stage);
	return new PayPalService(config);
});

export const handler = async (
	state: WrappedState<CreatePaymentMethodState>,
) => {
	try {
		console.info(`Input is ${JSON.stringify(state)}`);
		const createPaymentMethodState = wrapperSchemaForState(
			createPaymentMethodStateSchema,
		).parse(state).state;
		return createSalesforceContactState(
			state,
			await createPaymentMethod(
				createPaymentMethodState.paymentFields,
				createPaymentMethodState.user,
				createPaymentMethodState.product,
			),
		);
	} catch (error) {
		throw asRetryError(error);
	}
};

export function createPaymentMethod(
	paymentFields: PaymentFields,
	user: User,
	productType: ProductType,
): Promise<PaymentMethod> {
	switch (paymentFields.paymentType) {
		case 'Stripe':
			return createStripePaymentMethod(user.isTestUser, paymentFields);
		case 'StripeHostedCheckout':
			return createStripeHostedPaymentMethod(user.isTestUser, paymentFields);
		case 'PayPal':
			return createPayPalPaymentMethod(user.isTestUser, paymentFields);
		case 'DirectDebit':
			return createDirectDebitPaymentMethod(user, paymentFields, productType);
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
	wrappedState: WrappedState<CreatePaymentMethodState>,
	paymentMethod: PaymentMethod,
): WrappedState<CreateSalesforceContactState> {
	const outputState: CreateSalesforceContactState = {
		...wrappedState.state,
		paymentMethod,
	};

	return {
		state: outputState,
		error: null,
		requestInfo: wrappedState.requestInfo,
	};
}

export async function createStripePaymentMethod(
	isTestUser: boolean,
	paymentFields: StripePaymentFields,
): Promise<StripePaymentMethod> {
	const stripeService = await stripeServiceProvider.getServiceForUser(
		isTestUser,
	);
	const customer = await stripeService.createCustomer(
		paymentFields.stripePublicKey,
		paymentFields.paymentMethod,
	);
	return {
		TokenId: paymentFields.paymentMethod,
		SecondTokenId: customer.id,
		PaymentGateway: stripeService.getPaymentGateway(
			paymentFields.stripePublicKey,
		),
		Type: 'CreditCardReferenceTransaction',
		StripePaymentType: paymentFields.stripePaymentType,
	};
}

async function createStripeHostedPaymentMethod(
	isTestUser: boolean,
	{ stripePublicKey, checkoutSessionId }: StripeHostedPaymentFields,
): Promise<StripePaymentMethod> {
	const stripeService = await stripeServiceProvider.getServiceForUser(
		isTestUser,
	);
	if (!checkoutSessionId) {
		throw new Error(
			'Checkout session ID is required for Stripe hosted checkout',
		);
	}
	const paymentMethodId = getIfDefined(
		await stripeService.retrievePaymentMethodIdFromCheckoutSession(
			stripePublicKey,
			checkoutSessionId,
		),
		"Couldn't retrieve payment method ID from Stripe",
	);
	const customer = await stripeService.createCustomer(
		stripePublicKey,
		paymentMethodId,
	);

	return {
		TokenId: paymentMethodId,
		SecondTokenId: customer.id,
		PaymentGateway: stripeService.getPaymentGateway(stripePublicKey),
		Type: 'CreditCardReferenceTransaction',
	};
}

async function createPayPalPaymentMethod(
	isTestUser: boolean,
	payPal: PayPalPaymentFields,
): Promise<PayPalPaymentMethod> {
	const payPalService = await paypalServiceProvider.getServiceForUser(
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
	user: User,
	dd: DirectDebitPaymentFields,
	productType: ProductType,
): Promise<DirectDebitPaymentMethod> {
	const addressLine = combinedAddressLine(
		user.billingAddress.lineOne,
		user.billingAddress.lineTwo,
	);

	const shouldUseTortoiseMediaGateway =
		productType.productType === 'Paper' &&
		productType.productOptions === 'Sunday';

	return Promise.resolve({
		Type: 'BankTransfer',
		PaymentGateway: shouldUseTortoiseMediaGateway
			? tortoiseMediaDirectDebitGateway
			: guardianDirectDebitGateway,
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
