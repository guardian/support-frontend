import { getIfDefined } from '@guardian/support-service-lambdas/modules/nullAndUndefined';
import {
	isDeliveryProduct,
	requiresDeliveryInstructions,
} from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import type { ProductPurchase } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import { productPurchaseSchema } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import type {
	GiftRecipientType,
	ProductFields,
} from '../../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { FormAddress, FormPersonalFields } from './formDataExtractors';

export const buildProductInformation = ({
	productFields,
	productKey,
	ratePlanKey,
	personalData,
	deliveryAddress,
	firstDeliveryDate,
	deliveryInstructions,
	deliveryAgent,
	giftRecipient,
}: {
	productFields: ProductFields;
	productKey: string;
	ratePlanKey: string;
	personalData: FormPersonalFields;
	deliveryAddress: FormAddress | undefined;
	firstDeliveryDate: string | undefined;
	deliveryInstructions: string | undefined;
	deliveryAgent: number | undefined;
	giftRecipient: GiftRecipientType | undefined;
}): ProductPurchase => {
	let basicProductInformation: Record<string, unknown> = {
		product: productKey,
		ratePlan: ratePlanKey,
	};
	if (
		productFields.productType === 'Contribution' ||
		productFields.productType === 'SupporterPlus'
	) {
		return productPurchaseSchema.parse({
			...basicProductInformation,
			amount: productFields.amount,
		});
	}

	if (isDeliveryProduct(productKey)) {
		const deliveryDate = new Date(
			getIfDefined(
				firstDeliveryDate,
				'Delivery products require a first delivery date',
			),
		);
		const address = getIfDefined(
			deliveryAddress,
			'Delivery products require a delivery address',
		);
		const recipient = giftRecipient ? giftRecipient : personalData;

		basicProductInformation = {
			...basicProductInformation,
			firstDeliveryDate: deliveryDate,
			deliveryContact: {
				firstName: recipient.firstName,
				lastName: recipient.lastName,
				workEmail: recipient.email,
				country: address.country,
				state: address.state,
				city: address.city,
				address1: address.lineOne,
				address2: address.lineTwo,
				postalCode: address.postCode,
			},
		};
	}
	if (requiresDeliveryInstructions(productKey)) {
		basicProductInformation = {
			...basicProductInformation,
			deliveryInstructions: getIfDefined(
				deliveryInstructions,
				'Delivery instructions are required for Newspaper products, pass a blank string if necessary',
			),
		};
	}
	if (productKey === 'NationalDelivery') {
		basicProductInformation = {
			...basicProductInformation,
			deliveryAgent: deliveryAgent,
		};
	}

	return productPurchaseSchema.parse(basicProductInformation);
};
