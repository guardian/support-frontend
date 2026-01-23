import { z } from 'zod';
import { userSchema } from './stateSchemas';

export const checkoutFailureReasonSchema = z.enum([
	'Stripe payments are currently disabled',
	'insufficient_funds',
	'payment_details_incorrect',
	'payment_method_temporarily_declined',
	'payment_method_unacceptable',
	'payment_provider_unavailable',
	'payment_recently_taken',
	'production_test_account_mismatch',
	'unknown',
]);

export type CheckoutFailureReason = z.infer<typeof checkoutFailureReasonSchema>;

export const checkoutFailureStateSchema = z.object({
	user: userSchema,
	checkoutFailureReason: checkoutFailureReasonSchema,
});

export type CheckoutFailureState = z.infer<typeof checkoutFailureStateSchema>;
