import { z } from 'zod';
import { RetryErrorType } from './retryError';

export const errorFromStateSchema = z.object({
	errorType: z.nativeEnum(RetryErrorType),
	errorMessage: z.string(),
	trace: z.string().array(),
});
