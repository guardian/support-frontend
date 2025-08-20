import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import {
	createSubscription,
	type CreateSubscriptionInputFields,
} from '@modules/zuora/createSubscription/createSubscription';
import type { Contact } from '@modules/zuora/orders/newAccount';
import type { PaymentMethod as ZuoraPaymentMethod } from '@modules/zuora/orders/paymentMethods';
import { ZuoraClient } from '@modules/zuora/zuoraClient';
import type { Address } from '../model/address';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import type { PaymentMethod } from '../model/paymentMethod';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { asRetryError } from '../util/errorHandler';
import { getIfDefined } from '../util/nullAndUndefined';

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
		//  Apply promotion if present
		//  ReaderType - GIFT, PATRON
		//  DeliveryAgent
		//  Validate paper payment gateway
		//  Set term & autoRenew correctly for GW gifts (and S+ students?)
		//  Set contribution amount correctly for S+ (amount - cost)
		//  Output state
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

		const zuoraClient = await zuoraServiceProvider.getServiceForUser(false);
		const productCatalog = await productCatalogProvider.getServiceForUser(
			createZuoraSubscriptionState.user.isTestUser,
		);
		const result = await createSubscription(
			zuoraClient,
			productCatalog,
			inputFields,
		);

		return Promise.resolve({
			state: result,
		});
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
