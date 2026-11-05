import { storage } from '@guardian/libs';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, waitFor } from '@testing-library/react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
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

jest.mock('helpers/productCatalog', () => ({
	isProductKey: (productKey: string) => productKey === 'SupporterPlus',
	productCatalog: {
		SupporterPlus: {
			ratePlans: {
				Monthly: {
					billingPeriod: 'Monthly',
					pricing: { GBP: 20 },
				},
			},
		},
	},
}));

jest.mock('helpers/productPrice/legacyPromotion', () => ({
	getLegacyPromotion: jest.fn(),
}));

jest.mock('helpers/tracking/googleTagManager', () => ({
	successfulContributionConversion: jest.fn(),
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
const pendingOrder = {
	firstName: 'Example Supporter',
	email: 'supporter@example.com',
	status: 'pending',
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
		jest.mocked(getThankYouOrder).mockReturnValue(pendingOrder);
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

		renderThankYou();

		await waitFor(() => {
			expect(successfulContributionConversion).not.toHaveBeenCalled();
		});
	});
});
