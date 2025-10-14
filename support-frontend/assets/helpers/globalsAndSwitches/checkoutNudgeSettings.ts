import type { CountryGroupId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import type { ActiveProductKey, ActiveRatePlanKey } from '../productCatalog';

interface Product {
	product: ActiveProductKey;
	ratePlan: ActiveRatePlanKey;
}

interface Copy {
	heading: string;
	body?: string;
}

export interface CheckoutNudgeVariant {
	name: string;
	nudgeCopy: Copy;
	thankyouCopy: Copy;
	showBenefits: boolean;
	nudgeToProduct: Product;
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
