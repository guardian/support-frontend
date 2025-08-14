import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getProductCatalogFromApi } from '@modules/product-catalog/api';
import type { ProductCatalog } from '@modules/product-catalog/productCatalog';
import { ProductCatalogHelper } from '@modules/product-catalog/productCatalog';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import { createSubscription } from '@modules/zuora/createSubscription';
import type {
	Contact,
	PaymentMethod as ZuoraPaymentMethod,
} from '@modules/zuora/orders/newAccount';
import { ZuoraClient } from '@modules/zuora/zuoraClient';
import dayjs from 'dayjs';
import type { Address } from '../model/address';
import type {
	CreateZuoraSubscriptionState,
	ProductSpecificState,
} from '../model/createZuoraSubscriptionState';
import type { PaymentMethod } from '../model/paymentMethod';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { asRetryError } from '../util/errorHandler';
import { getIfDefined } from '../util/nullAndUndefined';
import { getSubscriptionDates } from '../util/subscriptionDates';

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
	const createZuoraSubscriptionState = state.state;
	const productSpecificState =
		createZuoraSubscriptionState.productSpecificState;
	const user = createZuoraSubscriptionState.user;
	try {
		console.info(`Input is ${JSON.stringify(state)}`);
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
		const soldToContact: Contact | undefined =
			getSoldToContact(productSpecificState);

		const salesforceContact = productSpecificState.salesForceContact;

		const productCatalog = await productCatalogProvider.getServiceForUser(
			createZuoraSubscriptionState.user.isTestUser,
		);
		const productInformation = getIfDefined(
			productSpecificState.productInformation,
			'productInformation is required',
		);
		const productRatePlanId = await getProductRatePlanId(
			productCatalog,
			productInformation,
		);
		const chargeOverride = getChargeOverride(
			productCatalog,
			productInformation,
		);
		const { contractEffectiveDate, customerAcceptanceDate } =
			getSubscriptionDates(dayjs(), productSpecificState);

		// TODO:
		//  Apply promotion if present
		//  ReaderType - GIFT, PATRON
		//  DeliveryAgent
		//  Validate paper payment gateway
		//  Set term & autoRenew correctly for GW gifts (and S+ students?)
		//  Set contribution amount correctly for S+ (amount - cost)
		//  Output state
		//  CSR mode is NOT needed

		const inputFields = {
			accountName: salesforceContact.AccountId, // We store the Salesforce Account id in the name field
			createdRequestId: createZuoraSubscriptionState.requestId,
			salesforceAccountId: salesforceContact.AccountId,
			salesforceContactId: salesforceContact.Id,
			identityId: createZuoraSubscriptionState.user.id,
			currency: currency,
			paymentGateway: productSpecificState.paymentMethod.PaymentGateway,
			paymentMethod: zuoraPaymentMethod,
			billToContact: billToContact,
			soldToContact: soldToContact,
			productRatePlanId: productRatePlanId,
			contractEffectiveDate: contractEffectiveDate,
			customerAcceptanceDate: customerAcceptanceDate,
			chargeOverride: chargeOverride,
			deliveryInstructions: user.deliveryInstructions,
			runBilling: true,
			collectPayment: true,
		};
		const zuoraClient = await zuoraServiceProvider.getServiceForUser(false);
		const result = await createSubscription(zuoraClient, inputFields);

		return Promise.resolve({
			state: result,
		});
	} catch (error) {
		throw asRetryError(error);
	}
};

const getProductRatePlanId = (
	productCatalog: ProductCatalog,
	productInformation: ProductPurchase,
): Promise<string> => {
	const productCatalogHelper = new ProductCatalogHelper(productCatalog);
	// TODO: Fix up  the types here
	const productRatePlan = productCatalogHelper.getProductRatePlan(
		productInformation.product,
		// @ts-expect-error this is safe, I just can't figure out how to convince TypeScript
		productInformation.ratePlan,
	);
	// @ts-expect-error this is safe, I just can't figure out how to convince TypeScript
	return productRatePlan.id as string;
};

export const getChargeOverride = (
	productCatalog: ProductCatalog,
	productInformation: ProductPurchase,
): { productRatePlanChargeId: string; overrideAmount: number } | undefined => {
	if (productInformation.product === 'Contribution') {
		const chargeId =
			productCatalog.Contribution.ratePlans[productInformation.ratePlan].charges
				.Contribution.id;
		return {
			productRatePlanChargeId: chargeId,
			overrideAmount: productInformation.amount,
		};
	} else if (productInformation.product === 'SupporterPlus') {
		if (
			//These are the only rate plans that have a contribution charge
			productInformation.ratePlan === 'Annual' ||
			productInformation.ratePlan === 'Monthly'
		) {
			const chargeId =
				productCatalog.SupporterPlus.ratePlans[productInformation.ratePlan]
					.charges.Contribution.id;
			return {
				productRatePlanChargeId: chargeId,
				overrideAmount: productInformation.amount,
			};
		}
	}
	return;
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

export const getSoldToContact = <T extends ProductSpecificState>(
	productSpecificState: T,
) => {
	switch (productSpecificState.productType) {
		case 'GuardianWeekly': {
			const user = productSpecificState.giftRecipient
				? productSpecificState.giftRecipient
				: {
						firstName: productSpecificState.user.firstName,
						lastName: productSpecificState.user.lastName,
						email: productSpecificState.user.primaryEmailAddress,
				  };

			return buildContact(
				user.firstName,
				user.lastName,
				user.email ?? '',
				getIfDefined(
					productSpecificState.user.deliveryAddress,
					'Delivery address is required for Guardian Weekly',
				),
			);
		}
		case 'TierThree':
		case 'Paper':
			return buildContact(
				productSpecificState.user.firstName,
				productSpecificState.user.lastName,
				productSpecificState.user.primaryEmailAddress,
				getIfDefined(
					productSpecificState.user.deliveryAddress,
					`Delivery address is required for ${productSpecificState.productType}`,
				),
			);
		case 'DigitalSubscription':
		case 'SupporterPlus':
		case 'GuardianAdLite':
		case 'Contribution':
			return;
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
