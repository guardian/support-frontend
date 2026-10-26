import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { StoryObj } from '@storybook/preact-vite';
import type React from 'react';
import { MemoryRouter } from 'react-router';
import { expect, within } from 'storybook/test';
import { AbParticipationsProvider } from 'contexts/AbParticipationsContext';
import { FeatureSwitchesProvider } from 'contexts/FeatureSwitchesContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import { hideTestBanner } from '../../.storybook/decorators/withoutTestBanner';

// The page reads promotions from window.guardian and URL params from the router
const withLandingPageContext = (Story: React.FC): JSX.Element => {
	// Clears the stub promotion set in .storybook/preview.js
	window.guardian.promotions = [];

	return (
		<MemoryRouter>
			<FeatureSwitchesProvider>
				<AbParticipationsProvider participations={{}}>
					<Story />
				</AbParticipationsProvider>
			</FeatureSwitchesProvider>
		</MemoryRouter>
	);
};

export default {
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

type Story = StoryObj<typeof ThreeTierLanding>;

// Each story renders one region and asserts its three monthly card prices
// (Support, All-access digital, Digital plus) from the product catalog fixture
const regionStory = (
	supportRegionId: SupportRegionId,
	monthlyPrices: [string, string, string],
): Story => ({
	args: { supportRegionId },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		for (const price of monthlyPrices) {
			await expect(await canvas.findByText(`${price}/month`)).toBeVisible();
		}
	},
});

export const UnitedKingdom = regionStory(SupportRegionId.UK, [
	'£5',
	'£12',
	'£18',
]);
export const UnitedStates = regionStory(SupportRegionId.US, [
	'$5',
	'$15',
	'$28',
]);
export const Australia = regionStory(SupportRegionId.AU, ['$10', '$20', '$30']);
export const Europe = regionStory(SupportRegionId.EU, ['€5', '€12', '€20']);
export const NewZealand = regionStory(SupportRegionId.NZ, ['$5', '$20', '$30']);
// Canada uses the tax exclusive rate plans for All-access digital and Digital plus
export const Canada = regionStory(SupportRegionId.CA, ['$5', '$15', '$30']);
export const International = regionStory(SupportRegionId.INT, [
	'$5',
	'$15',
	'$28',
]);
