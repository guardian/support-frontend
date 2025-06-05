import { z } from 'zod';
import { BillingPeriod } from '../../../../support-frontend/assets/helpers/productPrice/billingPeriods';

export const billingPeriodSchema = z.enum([
	BillingPeriod.Monthly,
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
]);
