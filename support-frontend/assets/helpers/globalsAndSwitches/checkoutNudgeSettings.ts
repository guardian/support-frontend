import type { CountryGroupId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import type { ActiveProductKey, ActiveRatePlanKey } from '../productCatalog';

interface Product {
	product: ActiveProductKey;
	ratePlan?: ActiveRatePlanKey;
}

interface Copy {
	heading: string;
	body?: string;
}

interface Benefits {
	label: string;
}

export interface CheckoutNudgeVariant {
	name: string;
	nudge?: {
		nudgeCopy: Copy;
		thankyouCopy: Copy;
		benefits?: Benefits;
		nudgeToProduct: Product;
	};
	promoCodes?: string[];
}

interface RegionTargeting {
	targetedCountryGroups: CountryGroupId[];
}

export interface CheckoutNudgeTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	nudgeFromProduct: Product;
	variants: CheckoutNudgeVariant[];
}
