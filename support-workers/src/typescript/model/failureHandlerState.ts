import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { z } from 'zod';
import { analyticsInfoSchema, userSchema } from './stateSchemas';

export const failureHandlerStateSchema = z.object({
	user: userSchema,
	productInformation: productPurchaseSchema,
	analyticsInfo: analyticsInfoSchema,
});

export type FailureHandlerState = z.infer<typeof failureHandlerStateSchema>;
