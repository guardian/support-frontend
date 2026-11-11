import { storage } from '@guardian/libs';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, waitFor } from '@testing-library/react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type * as ProductCatalogFixture from 'fixtures/productCatalogFixture';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { productCatalog } from 'helpers/productCatalog';
import { getLegacyPromotion } from 'helpers/productPrice/legacyPromotion';
import type { Promotion } from 'helpers/productPrice/promotions';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import { trackMParticleConversion } from 'helpers/tracking/mparticleConversions';
import type * as MParticleConversions from 'helpers/tracking/mparticleConversions';
import { getThankYouOrder } from '../checkout/helpers/sessionStorage';
import OnboardingComponent from '../components/onboardingComponent';
import { ThankYouComponent } from '../components/thankYouComponent';
import { ThankYou } from '../thankYou';

jest.mock('@guardian/libs', () => ({
	storage: {
		session: {
			get: jest.fn(),
		},
	},
}));

jest.mock('contexts/FeatureSwitchesContext', () => ({
	useFeatureSwitches: jest.fn(),
}));

jest.mock('helpers/productCatalog', () => {
	const { productCatalogFixture } = jest.requireActual<
		typeof ProductCatalogFixture
	>('fixtures/productCatalogFixture');
	const supporterPlus = productCatalogFixture.SupporterPlus;
	if (!supporterPlus) {
		throw new Error('SupporterPlus is missing from the catalog fixture');
	}
	return {
		isProductKey: (productKey: string) => productKey in productCatalogFixture,
		productCatalog: {
			...productCatalogFixture,
			SupporterPlus: {
				...supporterPlus,
				ratePlans: {
					...supporterPlus.ratePlans,
					Monthly: {
						...supporterPlus.ratePlans.Monthly,
						pricing: { GBP: 20, USD: 15 },
					},
				},
			},
		},
	};
});

jest.mock('helpers/productPrice/legacyPromotion', () => ({
	getLegacyPromotion: jest.fn(),
}));

jest.mock('helpers/tracking/googleTagManager', () => ({
	successfulContributionConversion: jest.fn(),
	getOrderId: () => 'session-order-123',
}));

jest.mock('helpers/tracking/mparticleConversions', () => ({
	...jest.requireActual<typeof MParticleConversions>(
		'helpers/tracking/mparticleConversions',
	),
	trackMParticleConversion: jest.fn(),
}));

jest.mock('../checkout/helpers/sessionStorage', () => ({
	getThankYouOrder: jest.fn(),
}));

jest.mock('../components/onboardingComponent', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('../components/thankYouComponent', () => ({
	ThankYouComponent: jest.fn(() => null),
}));

jest.mock('helpers/customHooks/analyticsProfileCache', () => ({
	AnalyticsProfileCacheProvider: ({ children }: { children: unknown }) =>
		children,
}));

const appConfig = {
	promotions: [],
	settings: {
		productsWithThankYouOnboarding: ['SupporterPlus'],
	},
} as unknown as AppConfig;

const landingPageSettings = {} as LandingPageVariant;
const webConfig = { apiKey: 'public-web-key', isDevelopmentMode: true };

// All sellable plans in the existing fixture for products served by this route.
// Discount is a price adjustment, and one-time contributions use the no-product URL.
const recurringProducts = [
	'Contribution',
	'DigitalSubscription',
	'GuardianAdLite',
	'GuardianWeeklyDomestic',
	'GuardianWeeklyRestOfWorld',
	'HomeDelivery',
	'NationalDelivery',
	'SubscriptionCard',
	'SupporterPlus',
] as const;
const catalogConversions = recurringProducts.flatMap((productType) => {
	const product = productCatalog[productType];
	if (!product) {
		throw new Error(`${productType} is missing from the catalog fixture`);
	}
	return Object.entries(product.ratePlans)
		.filter(([ratePlan]) => ratePlan !== 'Discount')
		.map(([ratePlan, details]) => ({
			productType,
			ratePlan,
			value: productType === 'Contribution' ? 7 : details.pricing.GBP,
			billingPeriod:
				ratePlan === 'OneYearGift'
					? 'Annual'
					: ratePlan === 'ThreeMonthGift'
					? 'Quarterly'
					: details.billingPeriod === 'Annual'
					? 'Annual'
					: details.billingPeriod === 'Quarter'
					? 'Quarterly'
					: 'Monthly',
		}));
});

const successfulOrder = {
	firstName: 'Example Supporter',
	email: 'supporter@example.com',
	status: 'success',
	paymentMethod: 'Stripe',
} as NonNullable<ReturnType<typeof getThankYouOrder>>;

const renderThankYou = () =>
	render(
		<ThankYou
			supportRegionId={SupportRegionId.UK}
			appConfig={appConfig}
			landingPageSettings={landingPageSettings}
		/>,
	);

describe('ThankYou conversion tracking', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		window.history.replaceState(
			{},
			'',
			'/?product=SupporterPlus&ratePlan=Monthly',
		);
		Object.defineProperty(window, 'guardian', {
			configurable: true,
			value: { csrf: { token: 'csrf-token' } },
		});
		jest.mocked(storage.session.get).mockReturnValue(null);
		jest.mocked(getThankYouOrder).mockReturnValue(successfulOrder);
		jest.mocked(getLegacyPromotion).mockReturnValue(undefined);
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableThankYouOnboarding: true,
		} as ReturnType<typeof useFeatureSwitches>);
	});

	it('emits the existing conversion values on the onboarding route', async () => {
		renderThankYou();

		await waitFor(() => {
			expect(successfulContributionConversion).toHaveBeenCalledTimes(1);
			expect(successfulContributionConversion).toHaveBeenCalledWith(
				20,
				'MONTHLY',
				'GBP',
				'Stripe',
				'SupporterPlus',
			);
		});
		expect(jest.mocked(OnboardingComponent)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(ThankYouComponent)).not.toHaveBeenCalled();
	});

	it('keeps the existing conversion values on the standard route', async () => {
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableThankYouOnboarding: false,
		} as ReturnType<typeof useFeatureSwitches>);

		renderThankYou();

		await waitFor(() => {
			expect(successfulContributionConversion).toHaveBeenCalledTimes(1);
			expect(successfulContributionConversion).toHaveBeenCalledWith(
				20,
				'MONTHLY',
				'GBP',
				'Stripe',
				'SupporterPlus',
			);
		});
		expect(jest.mocked(ThankYouComponent)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(OnboardingComponent)).not.toHaveBeenCalled();
	});

	it('does not emit a conversion when there is no stored order', async () => {
		jest.mocked(getThankYouOrder).mockReturnValue(undefined);
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableMParticleConversions: true,
		} as ReturnType<typeof useFeatureSwitches>);

		render(
			<ThankYou
				supportRegionId={SupportRegionId.UK}
				appConfig={{ ...appConfig, mParticleConversions: webConfig }}
				landingPageSettings={landingPageSettings}
			/>,
		);

		await waitFor(() => {
			expect(successfulContributionConversion).not.toHaveBeenCalled();
			expect(trackMParticleConversion).not.toHaveBeenCalled();
		});
	});

	it.each([true, false])(
		'uses mParticle on the enabled route (onboarding: %s) and cancels on unmount',
		(onboarding) => {
			const cancel = jest.fn();
			jest.mocked(trackMParticleConversion).mockReturnValue(cancel);
			jest.mocked(useFeatureSwitches).mockReturnValue({
				enableThankYouOnboarding: onboarding,
				enableMParticleConversions: true,
			} as ReturnType<typeof useFeatureSwitches>);
			const config = { apiKey: 'public-web-key', isDevelopmentMode: true };
			const { unmount, rerender } = render(
				<ThankYou
					supportRegionId={SupportRegionId.UK}
					appConfig={{ ...appConfig, mParticleConversions: config }}
					landingPageSettings={landingPageSettings}
				/>,
			);
			expect(successfulContributionConversion).toHaveBeenCalledWith(
				20,
				'MONTHLY',
				'GBP',
				'Stripe',
				'SupporterPlus',
				'mparticle',
			);
			expect(trackMParticleConversion).toHaveBeenCalledWith(config, {
				orderId: 'session-order-123',
				value: 20,
				currency: 'GBP',
				paymentMethod: 'Stripe',
				contributionType: 'MONTHLY',
				productType: 'SupporterPlus',
				ratePlan: 'Monthly',
				billingPeriod: 'Monthly',
			});
			rerender(
				<ThankYou
					supportRegionId={SupportRegionId.UK}
					appConfig={{ ...appConfig, mParticleConversions: config }}
					landingPageSettings={landingPageSettings}
				/>,
			);
			expect(trackMParticleConversion).toHaveBeenCalledTimes(1);
			unmount();
			expect(cancel).toHaveBeenCalledTimes(1);
		},
	);

	it.each(catalogConversions)(
		'sends $productType/$ratePlan with its exact plan, billing period and amount',
		({ productType, ratePlan, value, billingPeriod }) => {
			window.history.replaceState(
				{},
				'',
				`/?product=${productType}&ratePlan=${ratePlan}&contribution=7`,
			);
			jest.mocked(useFeatureSwitches).mockReturnValue({
				enableMParticleConversions: true,
			} as ReturnType<typeof useFeatureSwitches>);
			render(
				<ThankYou
					supportRegionId={SupportRegionId.UK}
					appConfig={{ ...appConfig, mParticleConversions: webConfig }}
					landingPageSettings={landingPageSettings}
				/>,
			);
			expect(value).toBeGreaterThan(0);
			expect(trackMParticleConversion).toHaveBeenCalledTimes(1);
			expect(trackMParticleConversion).toHaveBeenCalledWith(webConfig, {
				orderId: 'session-order-123',
				value: productType === 'SupporterPlus' ? (value ?? 0) + 7 : value,
				currency: 'GBP',
				paymentMethod: 'Stripe',
				productType,
				ratePlan,
				billingPeriod,
				contributionType: billingPeriod.toUpperCase(),
			});
			expect(successfulContributionConversion).toHaveBeenCalledWith(
				productType === 'SupporterPlus' ? (value ?? 0) + 7 : value,
				billingPeriod === 'Annual' ? 'ANNUAL' : 'MONTHLY',
				'GBP',
				'Stripe',
				productType,
				'mparticle',
			);
		},
	);

	it('sends a one-time contribution without product or rate-plan query parameters', () => {
		window.history.replaceState({}, '', '/?contribution=7.5');
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableMParticleConversions: true,
		} as ReturnType<typeof useFeatureSwitches>);
		render(
			<ThankYou
				supportRegionId={SupportRegionId.EU}
				appConfig={{ ...appConfig, mParticleConversions: webConfig }}
				landingPageSettings={landingPageSettings}
			/>,
		);
		expect(trackMParticleConversion).toHaveBeenCalledWith(webConfig, {
			orderId: 'session-order-123',
			value: 7.5,
			currency: 'EUR',
			paymentMethod: 'Stripe',
			productType: 'Contribution',
			ratePlan: 'OneTime',
			billingPeriod: 'OneTime',
			contributionType: 'ONE_OFF',
		});
	});

	it('uses the discounted price plus an additional contribution and normalizes express payment', () => {
		window.history.replaceState(
			{},
			'',
			'/?product=SupporterPlus&ratePlan=Monthly&contribution=3',
		);
		jest.mocked(getLegacyPromotion).mockReturnValue({
			discountedPrice: 4,
		} as Promotion);
		jest.mocked(getThankYouOrder).mockReturnValue({
			...successfulOrder,
			paymentMethod: 'StripeExpressCheckoutElement',
		});
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableMParticleConversions: true,
		} as ReturnType<typeof useFeatureSwitches>);
		render(
			<ThankYou
				supportRegionId={SupportRegionId.US}
				appConfig={{ ...appConfig, mParticleConversions: webConfig }}
				landingPageSettings={landingPageSettings}
			/>,
		);
		expect(trackMParticleConversion).toHaveBeenCalledWith(webConfig, {
			orderId: 'session-order-123',
			value: 7,
			currency: 'USD',
			paymentMethod: 'Stripe',
			productType: 'SupporterPlus',
			ratePlan: 'Monthly',
			billingPeriod: 'Monthly',
			contributionType: 'MONTHLY',
		});
	});

	it('keeps GTM when the public key is present but the switch is off', () => {
		jest.mocked(useFeatureSwitches).mockReturnValue({
			enableMParticleConversions: false,
		} as ReturnType<typeof useFeatureSwitches>);
		render(
			<ThankYou
				supportRegionId={SupportRegionId.UK}
				appConfig={{ ...appConfig, mParticleConversions: webConfig }}
				landingPageSettings={landingPageSettings}
			/>,
		);
		expect(trackMParticleConversion).not.toHaveBeenCalled();
		expect(successfulContributionConversion).toHaveBeenCalledWith(
			20,
			'MONTHLY',
			'GBP',
			'Stripe',
			'SupporterPlus',
		);
	});

	it('keeps GTM when the switch is enabled without a public key', () => {
		jest
			.mocked(useFeatureSwitches)
			.mockReturnValue({ enableMParticleConversions: true } as ReturnType<
				typeof useFeatureSwitches
			>);
		renderThankYou();
		expect(successfulContributionConversion).toHaveBeenCalledWith(
			20,
			'MONTHLY',
			'GBP',
			'Stripe',
			'SupporterPlus',
		);
		expect(trackMParticleConversion).not.toHaveBeenCalled();
	});
});
