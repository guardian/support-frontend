import { CurrencyValues } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import { z } from 'zod';

export const isoCurrencySchema = z.enum(CurrencyValues);
