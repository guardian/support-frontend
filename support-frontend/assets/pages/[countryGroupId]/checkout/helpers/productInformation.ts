import { getIfDefined } from '@guardian/support-service-lambdas/modules/nullAndUndefined';
import {
	isDeliveryProduct,
	requiresDeliveryInstructions,
} from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import type { ProductPurchase } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import { productPurchaseSchema } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import type { ProductFields } from '../../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from '../../../../helpers/productCatalog';
import type { FormAddress, FormPersonalFields } from './formDataExtractors';

export const buildProductInformation = (
	productFields: ProductFields,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	personalData: FormPersonalFields,
	deliveryAddress: FormAddress | undefined,
	firstDeliveryDate: string | null,
	deliveryInstructions: string,
	deliveryAgent: number | undefined,
): ProductPurchase => {
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
		basicProductInformation = {
			...basicProductInformation,
			firstDeliveryDate: deliveryDate,
			deliveryContact: {
				firstName: personalData.firstName,
				lastName: personalData.lastName,
				workEmail: personalData.email,
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
			deliveryInstructions,
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
