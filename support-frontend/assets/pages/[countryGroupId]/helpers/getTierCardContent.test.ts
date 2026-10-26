import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type * as ProductCatalog from 'helpers/productCatalog';
import {
	filterBenefitByRegion,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import { getTierCardContent } from './getTierCardContent';

jest.mock('helpers/productCatalog', () => ({
	...jest.requireActual<typeof ProductCatalog>('helpers/productCatalog'),
	productCatalog: {
		Contribution: {
			ratePlans: {
				Monthly: { pricing: { EUR: 4 } },
			},
		},
		SupporterPlus: {
			ratePlans: {
				Monthly: { pricing: { GBP: 6 } },
			},
		},
		DigitalSubscription: {
			ratePlans: {
				Annual: { pricing: { USD: 250 } },
				Monthly: { pricing: { GBP: 18 } },
			},
		},
	},
}));

const coreBenefits = {
	Contribution: [
		{ copy: 'Contribution benefit 1' },
		{ copy: 'Contribution benefit 2' },
	],
	SupporterPlus: [
		{ copy: 'SupporterPlus benefit 1' },
		{ copy: 'SupporterPlus benefit 2' },
	],
	DigitalSubscription: [
		{ copy: 'DigitalSubscription benefit 2' },
		{ copy: 'DigitalSubscription benefit 3' },
	],
};
const benefits = {
	CONTROL: {
		...coreBenefits,
		DigitalSubscription: [
			{ copy: 'Three extra accounts to share' },
			{ copy: 'DigitalSubscription benefit 2' },
			{ copy: 'DigitalSubscription benefit 3' },
		],
	},
	V1: coreBenefits,
	ProductCatalog: coreBenefits,
};
const prices = {
	USD: {
		Annual: {
			Contribution: 60,
			SupporterPlus: 150,
			DigitalSubscription: 250,
		},
		Monthly: {
			Contribution: 5,
			SupporterPlus: 15,
			DigitalSubscription: 25,
		},
	},
	GBP: {
		Annual: {
			Contribution: 50,
			SupporterPlus: 120,
			DigitalSubscription: 180,
		},
		Monthly: {
			Contribution: 5,
			SupporterPlus: 6,
			DigitalSubscription: 18,
		},
	},
	EUR: {
		Annual: {
			Contribution: 50,
			SupporterPlus: 140,
			DigitalSubscription: 200,
		},
		Monthly: {
			Contribution: 4,
			SupporterPlus: 6,
			DigitalSubscription: 20,
		},
	},
};

const emptyLandingPageVariant: LandingPageVariant = {
	name: '',
	copy: {
		heading: '',
		subheading: '',
	},
	products: {},
};
const landingPageVariantControl: LandingPageVariant = {
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism CONTROL',
		subheading: 'Choose to join with one of the options below. CONTROL',
	},
	products: {
		Contribution: {
			title: 'Contribution title',
			benefits: benefits.CONTROL.Contribution,
			cta: {
				copy: 'Contribution cta',
			},
		},
		SupporterPlus: {
			title: 'SupporterPlus title',
			benefits: benefits.CONTROL.SupporterPlus,
			cta: {
				copy: 'SupporterPlus cta',
			},
		},
		DigitalSubscription: {
			title: 'DigitalSubscription title',
			benefits: benefits.CONTROL.DigitalSubscription,
			cta: {
				copy: 'DigitalSubscription cta',
			},
		},
	},
	defaultProductSelection: {
		productType: 'SupporterPlus' as const, // default product type
		billingPeriod: 'Monthly' as const,
	},
};

const getLandingPageVariantCardContent = (
	product: 'Contribution' | 'SupporterPlus' | 'DigitalSubscription',
	ratePlan: 'Monthly' | 'Annual',
	supportRegionId: SupportRegionId,
	multipleAccountsVariant: 'CONTROL' | 'V1',
): CardContent => {
	const { currencyKey: countryCode } =
		getSupportRegionIdConfig(supportRegionId);
	return {
		product: product,
		ratePlan: ratePlan,
		price: prices[countryCode as 'GBP' | 'EUR' | 'USD'][ratePlan][product],
		link: `/${supportRegionId}/checkout?product=${product}&ratePlan=${ratePlan}`,
		title: `${product} title`,
		benefits: benefits[multipleAccountsVariant][product],
		cta: { copy: `${product} cta` },
		isDefaultProductSelected: product === 'SupporterPlus' ? true : false,
		multipleAccountsVariant: multipleAccountsVariant,
		isUserSelected: false,
	};
};

const getDefaultCardContent = (
	product: 'Contribution' | 'SupporterPlus' | 'DigitalSubscription',
	ratePlan: 'Monthly' | 'Annual',
	supportRegionId: SupportRegionId,
): CardContent => {
	const { currencyKey: countryCode, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	return {
		product: product,
		ratePlan: ratePlan,
		price: prices[countryCode as 'GBP' | 'EUR' | 'USD'][ratePlan][product],
		link: `/${supportRegionId}/checkout?product=${product}&ratePlan=${ratePlan}`,
		title: productCatalogDescription[product].label,
		titlePill: productCatalogDescription[product].labelPill,
		benefits: productCatalogDescription[product].benefits.filter((benefit) =>
			filterBenefitByRegion(benefit, countryGroupId),
		),
		cta: { copy: 'Support' },
		isDefaultProductSelected: false,
		isUserSelected: false,
	};
};

describe('getTierCardContent', () => {
	it('returns tier card content for eu monthly contribution from landingPage variant CONTROL', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'Contribution',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion: undefined,
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result).toEqual(
			getLandingPageVariantCardContent(
				'Contribution',
				'Monthly',
				SupportRegionId.EU,
				'CONTROL',
			),
		);
	});
	it('returns tier card content for uk monthly supporter plus from landingPage variant CONTROL', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.UK,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion: undefined,
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result).toEqual(
			getLandingPageVariantCardContent(
				'SupporterPlus',
				'Monthly',
				SupportRegionId.UK,
				'CONTROL',
			),
		);
	});
	it('returns tier card content for us annual digital subscription from landingPage variant CONTROL', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.US,
			productKey: 'DigitalSubscription',
			ratePlanKey: 'Annual',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion: undefined,
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result).toEqual(
			getLandingPageVariantCardContent(
				'DigitalSubscription',
				'Annual',
				SupportRegionId.US,
				'CONTROL',
			),
		);
	});
	/* We start with control benefits (digital subscription multiple accounts) then check V1 will filter it out */
	it('returns tier card content for uk monthly digital subscription from landingPage variant V1', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.UK,
			productKey: 'DigitalSubscription',
			ratePlanKey: 'Monthly',
			landingPageVariant: {
				...landingPageVariantControl,
				name: 'V1',
			},
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion: undefined,
			multipleAccountsVariant: 'V1',
		});
		expect(result).toEqual(
			getLandingPageVariantCardContent(
				'DigitalSubscription',
				'Monthly',
				SupportRegionId.UK,
				'V1',
			),
		);
	});
	it('returns tier card content for eu monthly contribution from the default catalog', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'Contribution',
			ratePlanKey: 'Monthly',
			landingPageVariant: emptyLandingPageVariant,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
		});
		expect(result).toEqual(
			getDefaultCardContent('Contribution', 'Monthly', SupportRegionId.EU),
		);
	});
	it('returns tier card content for uk monthly supporter plus from the default catalog', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.UK,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: emptyLandingPageVariant,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
		});
		expect(result).toEqual(
			getDefaultCardContent('SupporterPlus', 'Monthly', SupportRegionId.UK),
		);
	});
	it('returns tier card content for us annual digital subscription from the default catalog', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.US,
			productKey: 'DigitalSubscription',
			ratePlanKey: 'Annual',
			landingPageVariant: emptyLandingPageVariant,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
		});
		expect(result).toEqual(
			getDefaultCardContent(
				'DigitalSubscription',
				'Annual',
				SupportRegionId.US,
			),
		);
	});
	it('promotion applied (50% off for 3-month) to the monthly eu supporter plus checkout URL', () => {
		const promotion: Promotion = {
			name: 'Test promotion',
			description: 'Test promotion description',
			promoCode: '50PERCENTFOR3MONTHS',
			isIntroductoryPricing: true,
			discountedPrice: 2,
			discount: { amount: 2, durationMonths: 3 },
		};
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion,
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result).toMatchObject({
			link: '/eu/checkout?product=SupporterPlus&ratePlan=Monthly&promoCode=50PERCENTFOR3MONTHS',
			promotion,
		});
	});
	it('marks the card as selected when urlSelectedAmount matches the catalog price', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.UK,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: '6',
			enableDeepDiscount: false,
		});

		expect(result.isUserSelected).toBe(true);
	});
	it('marks the card as selected when urlSelectedAmount matches the promotion discount', () => {
		const promotion: Promotion = {
			name: 'Test promotion',
			description: 'Test promotion description',
			promoCode: '50PERCENTFOR3MONTHS',
			isIntroductoryPricing: true,
			discountedPrice: 2,
			discount: { amount: 2, durationMonths: 3 },
		};
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'Contribution',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: '2',
			enableDeepDiscount: false,
			urlProductKey: undefined,
			promotion,
		});

		expect(result.isUserSelected).toBe(true);
	});
	it('does not mark the card as selected when urlSelectedAmount matches neither price', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: '3',
			enableDeepDiscount: false,
		});

		expect(result.isUserSelected).toBe(false);
	});
	it('deep discount disabled, applies URL product selection (Contribution), overriding the landing page default product (SupporterPlus)', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: false,
			urlProductKey: 'Contribution',
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result.isDefaultProductSelected).toBe(false);
	});
	it('deep discount enabled, disables URL product selection (Contribution), allowing the landing page default product (SupporterPlus)', () => {
		const result = getTierCardContent({
			supportRegionId: SupportRegionId.EU,
			productKey: 'SupporterPlus',
			ratePlanKey: 'Monthly',
			landingPageVariant: landingPageVariantControl,
			urlSelectedAmount: null,
			enableDeepDiscount: true,
			urlProductKey: 'Contribution',
			multipleAccountsVariant: 'CONTROL',
		});
		expect(result.isDefaultProductSelected).toBe(true);
	});
});
