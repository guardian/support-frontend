import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import type {
	CreateSubscriptionInputFields,
	CreateSubscriptionResponse,
} from '@modules/zuora/createSubscription/createSubscription';
import { createSubscription } from '@modules/zuora/createSubscription/createSubscription';
import type {
	PreviewCreateSubscriptionInputFields,
	PreviewCreateSubscriptionResponse,
} from '@modules/zuora/createSubscription/previewCreateSubscription';
import { previewCreateSubscription } from '@modules/zuora/createSubscription/previewCreateSubscription';
import type { Contact } from '@modules/zuora/orders/newAccount';
import type { PaymentMethod as ZuoraPaymentMethod } from '@modules/zuora/orders/paymentMethods';
import { ZuoraClient } from '@modules/zuora/zuoraClient';
import { asRetryError } from '../errors/errorHandler';
import type { Address } from '../model/address';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import { buildPaymentSchedule } from '../model/paymentSchedule';
import type {
	SendAcquisitionEventState,
	SendThankYouEmailState,
} from '../model/sendAcquisitionEventState';
import { sendThankYouEmailStateSchema } from '../model/sendAcquisitionEventState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { getIfDefined } from '../util/nullAndUndefined';
import { zuoraDateReplacer } from '../util/zuoraDateReplacer';

const stage = stageFromEnvironment();

const zuoraServiceProvider = new ServiceProvider(stage, async (stage) => {
	return ZuoraClient.create(stage);
});

const productCatalogProvider = new ServiceProvider(stage, async (stage) => {
	return getProductCatalogFromApi(stage);
});

export const handler = async (
	state: WrappedState<CreateZuoraSubscriptionState>,
) => {
	try {
		console.info(`Input is ${JSON.stringify(state)}`);

		const createZuoraSubscriptionState = state.state;
		const productSpecificState =
			createZuoraSubscriptionState.productSpecificState;

		const user = createZuoraSubscriptionState.user;
		const currency: IsoCurrency = createZuoraSubscriptionState.product.currency;
		const zuoraPaymentMethod = getZuoraPaymentMethod(
			productSpecificState.paymentMethod,
		);

		const billToContact: Contact = buildContact(
			user.firstName,
			user.lastName,
			user.primaryEmailAddress,
			user.billingAddress,
		);

		const salesforceContact = productSpecificState.salesForceContact;

		const productInformation = getIfDefined(
			productSpecificState.productInformation,
			'productInformation is required',
		);

		// TODO:
		//  Prevent duplicates (Idempotency key?)
		//  Apply promotion if present
		//  Validate paper payment gateway? Might be done already by schema
		//  CSR mode is NOT needed

		const inputFields: CreateSubscriptionInputFields<ZuoraPaymentMethod> = {
			accountName: salesforceContact.AccountId, // We store the Salesforce Account id in the name field
			createdRequestId: createZuoraSubscriptionState.requestId,
			salesforceAccountId: salesforceContact.AccountId,
			salesforceContactId: salesforceContact.Id,
			identityId: createZuoraSubscriptionState.user.id,
			currency: currency,
			paymentGateway: productSpecificState.paymentMethod.PaymentGateway,
			paymentMethod: zuoraPaymentMethod,
			billToContact: billToContact,
			productPurchase: productInformation,
			runBilling: true,
			collectPayment: true,
		};

		const zuoraClient = await zuoraServiceProvider.getServiceForUser(
			createZuoraSubscriptionState.user.isTestUser,
		);
		const productCatalog = await productCatalogProvider.getServiceForUser(
			createZuoraSubscriptionState.user.isTestUser,
		);
		const createSubscriptionResult = await createSubscription(
			zuoraClient,
			productCatalog,
			inputFields,
		);

		const previewInputFields: PreviewCreateSubscriptionInputFields = {
			accountNumber: createSubscriptionResult.accountNumber,
			currency: currency,
			productPurchase: productInformation,
		};

		const previewInvoices = await previewCreateSubscription(
			zuoraClient,
			productCatalog,
			previewInputFields,
		);

		return JSON.stringify(
			buildOutputState(
				state,
				createZuoraSubscriptionState,
				createSubscriptionResult,
				previewInvoices,
			),
			zuoraDateReplacer,
		);
	} catch (error) {
		throw asRetryError(error);
	}
};

export const getZuoraPaymentMethod = (
	paymentMethod: PaymentMethod,
): ZuoraPaymentMethod => {
	switch (paymentMethod.Type) {
		case 'CreditCardReferenceTransaction':
			return {
				type: 'CreditCardReferenceTransaction',
				tokenId: paymentMethod.TokenId,
				secondTokenId: paymentMethod.SecondTokenId,
				cardNumber: paymentMethod.CreditCardNumber,
				expirationMonth: paymentMethod.CreditCardExpirationMonth,
				expirationYear: paymentMethod.CreditCardExpirationYear,
				cardType: paymentMethod.CreditCardType,
			};
		case 'PayPal':
			return {
				type: 'PayPalNativeEC',
				BAID: paymentMethod.PaypalBaid,
				email: paymentMethod.PaypalEmail,
			};
		case 'BankTransfer':
			return {
				type: 'Bacs',
				accountHolderInfo: {
					accountHolderName: paymentMethod.BankTransferAccountName,
				},
				accountNumber: paymentMethod.BankTransferAccountNumber,
				bankCode: paymentMethod.BankCode,
			};
	}
};

const buildContact = (
	firstName: string,
	lastName: string,
	email: string,
	address: Address,
) => {
	return {
		firstName: firstName,
		lastName: lastName,
		workEmail: email,
		country: address.country,
		state: address.state ?? undefined,
		city: address.city ?? undefined,
		address1: address.lineOne ?? undefined,
		address2: address.lineTwo ?? undefined,
		postalCode: address.postCode ?? undefined,
	};
};

export const buildOutputState = (
	wrappedState: WrappedState<CreateZuoraSubscriptionState>,
	createZuoraSubscriptionState: CreateZuoraSubscriptionState,
	createZuoraSubscriptionResult: CreateSubscriptionResponse,
	previewInvoices: PreviewCreateSubscriptionResponse,
): WrappedState<SendAcquisitionEventState> => {
	const subscriptionNumber = getIfDefined(
		createZuoraSubscriptionResult.subscriptionNumbers[0],
		'No subscription number returned from Zuora createSubscription call',
	);
	const paymentSchedule = buildPaymentSchedule(
		getIfDefined(
			previewInvoices.previewResult.invoices[0]?.invoiceItems,
			`Unable to build payment schedule for subscription ${subscriptionNumber} with state ${JSON.stringify(
				createZuoraSubscriptionState,
			)}. Preview invoices: ${JSON.stringify(previewInvoices)}`,
		),
	);

	// TODO: this needs extensive testing for all products
	return {
		state: {
			sendThankYouEmailState: buildSendThankYouEmailState(
				createZuoraSubscriptionState,
				createZuoraSubscriptionResult,
				paymentSchedule,
				subscriptionNumber,
			),
			requestId: createZuoraSubscriptionState.requestId,
			analyticsInfo: createZuoraSubscriptionState.analyticsInfo,
			acquisitionData: createZuoraSubscriptionState.acquisitionData,
		},
		requestInfo: wrappedState.requestInfo,
		error: wrappedState.error,
	};
};
const buildSendThankYouEmailState = (
	state: CreateZuoraSubscriptionState,
	createZuoraSubscriptionResult: CreateSubscriptionResponse,
	paymentSchedule: PaymentSchedule,
	subscriptionNumber: string,
): SendThankYouEmailState => {
	const { similarProductsConsent, firstDeliveryDate } = {
		similarProductsConsent: undefined,
		firstDeliveryDate: undefined,
		...state.productSpecificState.productInformation,
	};

	const { giftRecipient, appliedPromotion } = {
		giftRecipient: undefined,
		appliedPromotion: undefined,
		...state.productSpecificState,
	};

	return sendThankYouEmailStateSchema.parse({
		productType: state.product.productType,
		user: state.user,
		product: state.product,
		productInformation:
			state.productSpecificState.productInformation ?? undefined,
		paymentMethod: state.productSpecificState.paymentMethod,
		accountNumber: createZuoraSubscriptionResult.accountNumber,
		subscriptionNumber: subscriptionNumber,
		paymentSchedule: paymentSchedule,
		firstDeliveryDate: firstDeliveryDate,
		giftRecipient: giftRecipient,
		similarProductsConsent: similarProductsConsent,
		promoCode: appliedPromotion?.promoCode ?? undefined,
	});
};
