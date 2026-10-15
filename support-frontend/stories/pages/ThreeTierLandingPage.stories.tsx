import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { MemoryRouter } from 'react-router';
import { expect, userEvent, within } from 'storybook/test';
import { AbParticipationsProvider } from 'contexts/AbParticipationsContext';
import { FeatureSwitchesProvider } from 'contexts/FeatureSwitchesContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import { hideTestBanner } from '../../.storybook/decorators/withoutTestBanner';

type LandingPageParameters = {
	search?: string;
	promotions?: PromoWithCatalogInformation[];
};

// The page reads promotions from window.guardian and URL params from the router
const withLandingPageContext: Decorator = (Story, context) => {
	const { search = '', promotions = [] } =
		(context.parameters as { landingPage?: LandingPageParameters })
			.landingPage ?? {};
	window.guardian.promotions = promotions;

	return (
		<MemoryRouter initialEntries={[`/uk/contribute${search}`]}>
			<FeatureSwitchesProvider>
				<AbParticipationsProvider participations={{}}>
					<Story />
				</AbParticipationsProvider>
			</FeatureSwitchesProvider>
		</MemoryRouter>
	);
};

const meta: Meta<typeof ThreeTierLanding> = {
	title: 'Pages/Three Tier Landing',
	component: ThreeTierLanding,
	decorators: [withLandingPageContext, hideTestBanner],
	parameters: {
		docs: {
			description: {
				component:
					'A full-page rendering of the three tier landing page, using the fallback landing page variant and the product catalog fixture.',
			},
		},
		chromatic: {
			modes: {
				mobile: { viewport: 'mobile' },
				desktop: { viewport: 'desktop' },
				tablet: { viewport: 'tablet' },
				wide: { viewport: 'wide' },
			},
		},
	},
	args: {
		supportRegionId: SupportRegionId.UK,
		landingPageSettings: {
			variant: fallBackLandingPageSelection,
			participations: {},
		},
	},
};

export default meta;

type Story = StoryObj<typeof ThreeTierLanding>;

const supporterPlusPromotion: PromoWithCatalogInformation = {
	promoCode: 'STORYBOOK25',
	name: 'Storybook 25% off',
	campaignCode: 'STORYBOOK_CAMPAIGN',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [
			{ productKey: 'SupporterPlus', productRatePlanKey: 'Monthly' },
			{ productKey: 'SupporterPlus', productRatePlanKey: 'Annual' },
		],
	},
	startTimestamp: '2023-01-01T00:00:00.000Z',
	endTimestamp: '2099-12-31T23:59:59.000Z',
	discount: { amount: 25, durationMonths: 12 },
};

export const Monthly: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(await canvas.findByText('£5/month')).toBeVisible();
		await expect(await canvas.findByText('£12/month')).toBeVisible();
		await expect(await canvas.findByText('£18/month')).toBeVisible();

		await userEvent.click(canvas.getByRole('tab', { name: 'Annual' }));

		await expect(await canvas.findByText('£60/year')).toBeVisible();
		await expect(await canvas.findByText('£120/year')).toBeVisible();
		await expect(await canvas.findByText('£180/year')).toBeVisible();
	},
};

export const Annual: Story = {
	parameters: { landingPage: { search: '?ratePlan=annual' } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(await canvas.findByText('£60/year')).toBeVisible();
		await expect(canvas.queryByText('£5/month')).not.toBeInTheDocument();
	},
};

export const WithPromotion: Story = {
	parameters: { landingPage: { promotions: [supporterPlusPromotion] } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// 25% off the £12 monthly price
		await expect(await canvas.findByText(/£9\/month/)).toBeVisible();
	},
};

export const UnitedStates: Story = {
	args: { supportRegionId: SupportRegionId.US },
};

export const CanadaTaxExclusive: Story = {
	args: { supportRegionId: SupportRegionId.CA },
};
