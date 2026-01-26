import { z } from 'zod';
import { checkoutFailureReasons } from '../errors/checkoutFailureReasons';
import { userSchema } from './stateSchemas';

export const checkoutFailureReasonSchema = z.enum(checkoutFailureReasons);

export const checkoutFailureStateSchema = z.object({
	user: userSchema,
	checkoutFailureReason: checkoutFailureReasonSchema,
});

export type CheckoutFailureState = z.infer<typeof checkoutFailureStateSchema>;
